/**
 * Signalling functionality for ItsyPoker planning poker application
 * Manages WebSocket communication with the signalling server for room management and WebRTC handshake
 */
import { createPeerConnection, createOffer, handleOffer, handleAnswer, addIceCandidate } from './webrtc-simple';
import { appState } from './stores';
import type { SignallingMessage } from './types';

/**
 * WebSocket connection to the signalling server
 */
let socket: WebSocket | null = null;

/**
 * Establish WebSocket connection to the signalling server
 * @throws {Error} If connection fails
 */
export async function connectToSignallingServer(): Promise<void> {
    return new Promise((resolve, reject) => {
        // Use secure WebSocket if the page is served over HTTPS
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

        // Connect to the signalling server
        // In production, this would be a deployed server URL
        // For development, we'll use a local server
        const serverUrl = `${protocol}//${window.location.hostname}:3000`;
        socket = new WebSocket(serverUrl);

        socket.onopen = () => {
            console.log('Connected to signalling server');
            resolve();
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            reject(error);
        };

        socket.onclose = () => {
            console.log('Disconnected from signalling server');
        };

        socket.onmessage = (event) => {
            try {
                // Parse the incoming message
                const message = JSON.parse(event.data);
                handleSignallingMessage(message);
            } catch (error) {
                console.error('Error parsing signalling message:', error);
            }
        };
    });
}

/**
 * Request creation of a new planning poker room
 * @param username - The username of the room creator
 * @returns Promise that resolves to the room ID
 * @throws {Error} If not connected to server or room creation fails
 */
export async function createRoom(username: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            reject(new Error('Not connected to signalling server'));
            return;
        }

        // Send a create-room request
        sendSignallingMessage({
            type: 'create-room',
            username: username
        });

        // Set up a one-time handler for room creation response
        const messageHandler = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'room-created') {
                    if (socket) {
                        socket.removeEventListener('message', messageHandler);
                    }
                    resolve(data.roomId);
                }
            } catch (error) {
                console.error('Error parsing room creation response:', error);
                reject(error);
            }
        };

        socket.addEventListener('message', messageHandler);
    });
}

/**
 * Request to join an existing planning poker room
 * @param roomId - The room identifier to join
 * @param username - The participant's display name
 * @throws {Error} If not connected to server or room doesn't exist
 */
export async function joinRoom(roomId: string, username: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            reject(new Error('Not connected to signalling server'));
            return;
        }

        // Send join room request
        sendSignallingMessage({
            type: 'join-room',
            roomId: roomId,
            username: username
        });

        // Set up a one-time handler for join response
        const messageHandler = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'room-joined') {
                    if (socket) {
                        socket.removeEventListener('message', messageHandler);
                    }

                    // Update app state with existing participants
                    if (Array.isArray(data.participants)) {
                        appState.update(state => {
                            // Add all existing participants to the store
                            data.participants.forEach((participant: string) => {
                                if (participant !== username && !state.participants[participant]) {
                                    state.participants[participant] = {
                                        username: participant,
                                        isHost: false, // Only the creator is host initially
                                        hasVoted: false,
                                        vote: null
                                    };
                                }
                            });
                            return state;
                        });

                        // Create peer connections with existing participants
                        data.participants.forEach((participant: string) => {
                            if (participant !== username) {
                                createPeerConnection(participant, true);
                                createOffer(participant);
                            }
                        });
                    }

                    resolve();
                } else if (data.type === 'error') {
                    if (socket) {
                        socket.removeEventListener('message', messageHandler);
                    }
                    reject(new Error(data.message));
                }
            } catch (error) {
                console.error('Error parsing room join response:', error);
                if (socket) {
                    socket.removeEventListener('message', messageHandler);
                }
                reject(error);
            }
        };

        socket.addEventListener('message', messageHandler);
    });
}

/**
 * Send a message to the signalling server
 * @param message - The signalling message to send
 */
export function sendSignallingMessage(message: Partial<SignallingMessage>): void {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        console.error('Cannot send message, not connected to signalling server');
    }
}

/**
 * Process incoming messages from the signalling server
 * @param message - The received signalling message
 */
function handleSignallingMessage(message: any): void {
    console.log('Received signalling message:', message);

    switch (message.type) {
        case 'new-peer':
            // A new peer has joined the room
            // Add them to participants list
            appState.update(state => {
                if (message.username && !state.participants[message.username]) {
                    state.participants[message.username] = {
                        username: message.username,
                        isHost: false,
                        hasVoted: false,
                        vote: null
                    };
                }
                return state;
            });
            
            // Create peer connection but don't automatically create an offer
            // Let the joining peer initiate the connection to avoid both sides creating offers
            createPeerConnection(message.username, false);
            break;

        case 'offer':
            // Received an offer from a peer
            handleOffer(message.from, message.offer);
            break;

        case 'answer':
            // Received an answer from a peer
            handleAnswer(message.from, message.answer);
            break;

        case 'ice-candidate':
            // Received an ICE candidate from a peer
            addIceCandidate(message.from, message.candidate);
            break;

        case 'peer-disconnected':
            // A peer has disconnected
            console.log(`Peer ${message.username} disconnected`);
            
            // Remove from participants list
            appState.update(state => {
                if (message.username && state.participants[message.username]) {
                    delete state.participants[message.username];
                }
                return state;
            });
            break;

        case 'error':
            // Error from the server
            console.error('Server error:', message.message);
            break;
    }
}
