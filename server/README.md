# ItsyPoker Signalling Server

The signalling server for ItsyPoker is a lightweight WebSocket server that facilitates WebRTC peer connection establishment between clients participating in planning poker sessions.

## Overview

This server acts as a relay for WebRTC signalling messages and manages room creation/joining. It does not handle actual planning poker game data - that flows directly between peers via WebRTC data channels.

## Features

- Room creation and management
- WebRTC signalling relay (offers, answers, ICE candidates)
- Participant tracking and notifications
- Connection state management
- Error handling and validation

## Architecture

### Server Components

- **`signalling-server.ts`** - Main WebSocket server implementation
- **`types.ts`** - TypeScript interfaces for messages and data structures

### Message Flow

1. **Room Management**: Clients create/join rooms via WebSocket messages
2. **WebRTC Handshake**: Server relays offers, answers, and ICE candidates between peers
3. **Peer Notifications**: Server notifies clients when peers join/leave
4. **Direct Communication**: Once WebRTC is established, game data flows peer-to-peer

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

### Development Mode

Start the server with TypeScript compilation and auto-restart:

```bash
npm run start
```

This will:
- Compile TypeScript files
- Start the server with nodemon for auto-restart on changes
- Listen on port 3000 (or PORT environment variable)

### Production Mode

1. Build the TypeScript files:
   ```bash
   npm run build
   ```

2. Start the compiled server:
   ```bash
   node signalling-server.js
   ```

## Configuration

### Environment Variables

- **`PORT`** - Server port (default: 3000)

### Server Settings

The server configuration can be modified in `signalling-server.ts`:

```typescript
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
```

## API Reference

### WebSocket Messages

#### Client → Server

**Create Room**
```json
{
  "type": "create-room",
  "username": "string"
}
```

**Join Room**
```json
{
  "type": "join-room",
  "roomId": "string",
  "username": "string"
}
```

**WebRTC Offer**
```json
{
  "type": "offer",
  "username": "string",
  "from": "string",
  "peerId": "string",
  "offer": "RTCSessionDescriptionInit"
}
```

**WebRTC Answer**
```json
{
  "type": "answer",
  "username": "string",
  "from": "string", 
  "peerId": "string",
  "answer": "RTCSessionDescriptionInit"
}
```

**ICE Candidate**
```json
{
  "type": "ice-candidate",
  "username": "string",
  "from": "string",
  "peerId": "string",
  "candidate": "RTCIceCandidateInit"
}
```

#### Server → Client

**Room Created**
```json
{
  "type": "room-created",
  "roomId": "string"
}
```

**Room Joined**
```json
{
  "type": "room-joined",
  "roomId": "string",
  "participants": ["string"]
}
```

**New Peer**
```json
{
  "type": "new-peer",
  "username": "string"
}
```

**Peer Disconnected**
```json
{
  "type": "peer-disconnected",
  "username": "string"
}
```

**Error**
```json
{
  "type": "error",
  "message": "string"
}
```

## Testing

Run the server tests:

```bash
# From project root
npm test:run

# Or specifically server tests
npm test -- tests/server/
```

### Test Coverage

- Room creation and joining
- Message routing and relay
- Error handling
- Connection management
- WebRTC signalling flow

## Development

### Code Structure

```
server/
├── signalling-server.ts    # Main server implementation
├── types.ts               # TypeScript interfaces
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

### Key Functions

- **`handleMessage()`** - Routes incoming WebSocket messages
- **`createRoom()`** - Creates new poker rooms
- **`joinRoom()`** - Adds users to existing rooms
- **`relayMessage()`** - Forwards WebRTC signalling between peers
- **`handleDisconnection()`** - Cleans up when clients disconnect

### Adding Features

To extend the server functionality:

1. Define new message types in `types.ts`
2. Add message handlers in `signalling-server.ts`
3. Update the routing logic in `handleMessage()`
4. Add corresponding tests

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
Error: listen EADDRINUSE :::3000
```
- Change the port: `PORT=3001 npm run start`
- Kill existing process: `pkill -f "node.*signalling-server"`

**WebSocket Connection Failed**
- Ensure server is running
- Check firewall settings
- Verify client is connecting to correct port/host

**Messages Not Routing**
- Check server logs for errors
- Verify message format matches expected interfaces
- Ensure room exists before sending messages

## License

This project is licensed under the MIT License.
