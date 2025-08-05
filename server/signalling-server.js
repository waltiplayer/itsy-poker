/**
 * Signalling server for ItsyPoker planning poker application
 * Manages WebSocket connections, room creation/joining, and WebRTC signalling relay
 */
import { WebSocket, WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
/**
 * WebSocket server configuration
 */
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const wss = new WebSocketServer({ port: PORT });
console.log(`Signalling server running on port ${PORT}`);
/**
 * Server state storage
 */
/** Map of room IDs to sets of participant usernames */
const rooms = new Map();
/** Map of usernames to client connection information */
const clients = new Map();
/**
 * Handle new WebSocket connections
 */
wss.on('connection', (ws) => {
    console.log('Client connected');
    // Handle messages from clients
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());
            handleMessage(ws, data);
        }
        catch (error) {
            console.error('Error parsing message:', error);
            sendError(ws, 'Invalid message format');
        }
    });
    // Handle client disconnection
    ws.on('close', () => {
        handleDisconnection(ws);
    });
});
/**
 * Process incoming messages from clients
 * @param ws - The WebSocket connection
 * @param message - The parsed message from client
 */
function handleMessage(ws, message) {
    try {
        console.log('Received message:', message);
        switch (message.type) {
            case 'create-room':
                createRoom(ws, message);
                break;
            case 'join-room':
                joinRoom(ws, message);
                break;
            case 'offer':
            case 'answer':
            case 'ice-candidate':
                relayMessage(message);
                break;
            default:
                console.warn('Unknown message type:', message.type);
                sendError(ws, 'Unknown message type');
        }
    }
    catch (e) {
        console.error('Error handling message:', e);
    }
}
/**
 * Handle room creation request
 * @param ws - The WebSocket connection of the room creator
 * @param message - The room creation request message
 */
function createRoom(ws, message) {
    const roomId = generateRoomId();
    const username = message.username;
    // Create a new room
    rooms.set(roomId, new Set([username]));
    // Store client info
    clients.set(username, { ws, roomId });
    // Send room created confirmation
    ws.send(JSON.stringify({
        type: 'room-created',
        roomId: roomId
    }));
    console.log(`Room ${roomId} created by ${username}`);
}
/**
 * Handle room joining request
 * @param ws - The WebSocket connection of the joining client
 * @param message - The room join request message
 */
function joinRoom(ws, message) {
    const roomId = message.roomId;
    const username = message.username;
    // Check if the room exists
    if (!rooms.has(roomId)) {
        sendError(ws, 'Room does not exist');
        return;
    }
    // Get room participants
    const participants = rooms.get(roomId);
    if (participants === undefined) {
        throw new Error('Room participants not found');
    }
    // Check if room is full (max 10 participants)
    if (participants.size >= 10) {
        sendError(ws, 'Room is full');
        return;
    }
    // Add user to room
    participants.add(username);
    // Store client info
    clients.set(username, { ws, roomId });
    // Send room joined confirmation
    ws.send(JSON.stringify({
        type: 'room-joined',
        roomId: roomId,
        participants: Array.from(participants)
    }));
    // Notify other participants about the new peer
    notifyPeers(roomId, username, {
        type: 'new-peer',
        username: username
    });
    console.log(`User ${username} joined room ${roomId}`);
}
/**
 * Relay WebRTC signalling messages between peers
 * @param message - The signalling message to relay
 */
function relayMessage(message) {
    const targetPeerId = message.peerId;
    // Find the target client
    const targetClient = clients.get(targetPeerId);
    if (targetClient) {
        // Forward the message to the target client
        targetClient.ws.send(JSON.stringify(message));
    }
    else {
        console.warn(`Target client ${targetPeerId} not found`);
    }
}
/**
 * Handle client disconnection and cleanup
 * @param ws - The disconnected WebSocket connection
 */
function handleDisconnection(ws) {
    // Find the disconnected client
    let disconnectedUsername = null;
    let roomId = null;
    for (const [username, client] of clients.entries()) {
        if (client.ws === ws) {
            disconnectedUsername = username;
            roomId = client.roomId;
            break;
        }
    }
    if (disconnectedUsername && roomId) {
        // Remove client from clients map
        clients.delete(disconnectedUsername);
        // Remove client from room
        const room = rooms.get(roomId);
        if (room) {
            room.delete(disconnectedUsername);
            // If room is empty, remove it
            if (room.size === 0) {
                rooms.delete(roomId);
                console.log(`Room ${roomId} removed (empty)`);
            }
            else {
                // Notify other participants about the disconnection
                notifyPeers(roomId, disconnectedUsername, {
                    type: 'peer-disconnected',
                    username: disconnectedUsername
                });
            }
        }
        console.log(`User ${disconnectedUsername} disconnected from room ${roomId}`);
    }
}
/**
 * Send a message to all peers in a room except the specified one
 * @param roomId - The room to send messages to
 * @param excludeUsername - Username to exclude from notification
 * @param message - The message to send
 */
function notifyPeers(roomId, excludeUsername, message) {
    const room = rooms.get(roomId);
    if (room) {
        for (const username of room) {
            if (username !== excludeUsername) {
                const client = clients.get(username);
                if (client && client.ws.readyState === WebSocket.OPEN) {
                    client.ws.send(JSON.stringify(message));
                }
            }
        }
    }
}
/**
 * Send an error message to a specific client
 * @param ws - The WebSocket connection to send error to
 * @param message - The error message text
 */
function sendError(ws, message) {
    ws.send(JSON.stringify({
        type: 'error',
        message: message
    }));
}
/**
 * Generate a unique, short room ID
 * @returns A 6-character room identifier
 */
function generateRoomId() {
    // Generate a short, readable ID (first 6 characters of a UUID)
    return uuidv4().substring(0, 6);
}
/**
 * Handle graceful server shutdown on SIGINT (Ctrl+C)
 */
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    // Close all connected WebSocket clients
    wss.clients.forEach((client) => {
        try {
            if (client.readyState === WebSocket.OPEN) {
                client.close(1001, 'Server shutting down'); // 1001: Going Away
            }
        }
        catch (error) {
            console.error('Error closing client connection:', error);
        }
    });
    // Close the WebSocket server
    try {
        wss.close(() => {
            console.log('Server shut down');
            process.exit(0);
        });
    }
    catch (error) {
        console.error('Error shutting down WebSocket server:', error);
        process.exit(1); // Exit with error code
    }
});
//# sourceMappingURL=signalling-server.js.map