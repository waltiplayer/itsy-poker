/**
 * Simplified WebRTC functionality for ItsyPoker planning poker application
 * Manages peer-to-peer connections and data channels for real-time communication
 */
import { get } from 'svelte/store';
import { handlePeerData, appState } from './stores';
import { sendSignallingMessage } from './signalling';
import type { DataMessage } from './types';

/**
 * WebRTC configuration with STUN servers for NAT traversal
 */
const configuration: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

/**
 * Map of peer IDs to their RTCPeerConnection instances
 */
const peerConnections: Record<string, RTCPeerConnection> = {};

/**
 * Initialize WebRTC functionality
 */
export function initWebRTC(): void {
    console.log('Initializing WebRTC...');
}

/**
 * Send data to all connected peers
 */
export function sendData(message: DataMessage): void {
    console.log('Sending data to peers:', message);
    const state = get(appState);
    Object.keys(state.dataChannels).forEach(peerId => {
        const dataChannel = state.dataChannels[peerId];
        if (dataChannel && dataChannel.readyState === 'open') {
            try {
                dataChannel.send(JSON.stringify(message));
            } catch (error) {
                console.error(`Failed to send data to ${peerId}:`, error);
            }
        }
    });
}

/**
 * Create a new RTCPeerConnection for a specific peer
 */
export function createPeerConnection(peerId: string, isInitiator: boolean): RTCPeerConnection {
    console.log(`Creating peer connection for ${peerId}, initiator: ${isInitiator}`);

    const peerConnection = new RTCPeerConnection(configuration);
    peerConnections[peerId] = peerConnection;

    let dataChannel: RTCDataChannel;

    if (isInitiator) {
        dataChannel = peerConnection.createDataChannel('pokerData');
        setupDataChannel(dataChannel, peerId);
    } else {
        peerConnection.ondatachannel = (event) => {
            dataChannel = event.channel;
            setupDataChannel(dataChannel, peerId);
        };
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            const state = get(appState);
            if (state.username) {
                sendSignallingMessage({
                    type: 'ice-candidate',
                    candidate: event.candidate,
                    peerId: peerId,
                    from: state.username
                });
            } else {
                console.warn('Cannot send ICE candidate: username not set');
            }
        }
    };

    return peerConnection;
}

/**
 * Set up data channel event handlers
 */
function setupDataChannel(dataChannel: RTCDataChannel, peerId: string): void {
    // Store the data channel
    appState.update(state => {
        state.dataChannels[peerId] = dataChannel;
        return state;
    });

    dataChannel.onopen = () => {
        console.log(`Data channel opened for ${peerId}`);
        
        // Notify all peers when this data channel opens that this participant has joined
        const state = get(appState);
        const joinMessage: DataMessage = {
            type: 'participantJoined',
            username: state.username
        };
        
        // Send after a small delay to ensure the channel is fully open
        setTimeout(() => {
            if (dataChannel.readyState === 'open') {
                try {
                    // First send join message
                    dataChannel.send(JSON.stringify(joinMessage));
                    
                    // Then send current state to synchronize with the new peer
                    const stateMessage: DataMessage = {
                        type: 'state',
                        participants: state.participants,
                        revealedVotes: state.revealedVotes
                    };
                    dataChannel.send(JSON.stringify(stateMessage));
                } catch (error) {
                    console.error('Failed to send join/state messages:', error);
                }
            }
        }, 100);
    };

    dataChannel.onmessage = (event) => {
        try {
            const message: DataMessage = JSON.parse(event.data);
            handlePeerData(message, peerId);
        } catch (error) {
            console.error('Failed to parse peer message:', error);
        }
    };

    dataChannel.onclose = () => {
        console.log(`Data channel closed for ${peerId}`);
        
        // Notify other peers that this participant has left
        const leftMessage: DataMessage = {
            type: 'participantLeft',
            username: peerId
        };
        sendData(leftMessage);
        
        // Remove from local state
        appState.update(state => {
            delete state.dataChannels[peerId];
            // Also remove from participants if they disconnected
            if (state.participants[peerId]) {
                delete state.participants[peerId];
            }
            return state;
        });
    };
}

/**
 * Create an offer for a peer connection
 */
export async function createOffer(peerId: string): Promise<void> {
    const peerConnection = peerConnections[peerId];
    if (!peerConnection) return;

    try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        const state = get(appState);
        if (state.username) {
            sendSignallingMessage({
                type: 'offer',
                offer: offer,
                peerId: peerId,
                from: state.username
            });
        } else {
            console.warn('Cannot send offer: username not set');
        }
    } catch (error) {
        console.error('Error creating offer:', error);
    }
}

/**
 * Handle an offer from a peer
 */
export async function handleOffer(peerId: string, offer: RTCSessionDescriptionInit): Promise<void> {
    const peerConnection = peerConnections[peerId];
    if (!peerConnection) return;

    try {
        await peerConnection.setRemoteDescription(offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        const state = get(appState);
        if (state.username) {
            sendSignallingMessage({
                type: 'answer',
                answer: answer,
                peerId: peerId,
                from: state.username
            });
        } else {
            console.warn('Cannot send answer: username not set');
        }
    } catch (error) {
        console.error('Error handling offer:', error);
    }
}

/**
 * Handle an answer from a peer
 */
export async function handleAnswer(peerId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    const peerConnection = peerConnections[peerId];
    if (!peerConnection) return;

    try {
        await peerConnection.setRemoteDescription(answer);
    } catch (error) {
        console.error('Error handling answer:', error);
    }
}

/**
 * Add ICE candidate to peer connection
 */
export async function addIceCandidate(peerId: string, candidate: RTCIceCandidateInit): Promise<void> {
    const peerConnection = peerConnections[peerId];
    if (!peerConnection) return;

    try {
        await peerConnection.addIceCandidate(candidate);
    } catch (error) {
        console.error('Error adding ICE candidate:', error);
    }
}