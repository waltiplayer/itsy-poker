# ItsyPoker

A modern web-based planning poker application that enables distributed teams to estimate project complexity using peer-to-peer WebRTC communication for real-time collaboration.

## Overview

ItsyPoker uses a hybrid architecture combining centralized signalling with decentralized game data:

- **Centralized Signalling**: WebSocket server handles room management and WebRTC handshake
- **Decentralized Game Data**: Direct peer-to-peer communication via WebRTC data channels
- **Real-time Collaboration**: Support for 2-10 participants per room with instant vote synchronization

## Features

- **Room Management**: Create and join planning poker sessions with unique room IDs
- **Real-time Voting**: Standard planning poker cards (1, 2, 3, 5, 8, 13, ?)
- **Host Controls**: Reveal votes and start new rounds
- **Peer-to-Peer**: Direct WebRTC communication for low-latency game state synchronization
- **Modern UI**: Responsive design built with Svelte and Tailwind CSS
- **Type Safety**: Full TypeScript implementation across client and server

## Tech Stack

### Frontend (Client)
- **Framework**: Svelte 5 with TypeScript
- **Build Tool**: Vite 6 with hot module replacement
- **Styling**: Tailwind CSS 3 with PostCSS
- **Testing**: Vitest with Happy DOM
- **Communication**: WebRTC for P2P, WebSocket for signalling

### Backend (Server)
- **Runtime**: Node.js with TypeScript
- **WebSocket**: Native WebSocket server for signalling
- **Development**: Nodemon for auto-restart
- **Testing**: Vitest

## Quick Start

### Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)

### Installation

1. Clone the repository and install dependencies:
   ```bash
   git clone <repository-url>
   cd ItsyPoker
   npm install
   ```

### Development Setup

1. **Start the signalling server** (Terminal 1):
   ```bash
   npm run server:start
   ```
   Server will start on `http://localhost:3000`

2. **Start the client development server** (Terminal 2):
   ```bash
   npm run client:dev
   ```
   Client will start on `http://localhost:8080`

3. **Access the application**:
   Open your browser to `http://localhost:8080`

### Production Build

```bash
# Build client for production
npm run client:build

# Start production server
npm run server:start
```

## Architecture

### Project Structure

```
ItsyPoker/
├── client/                     # Svelte frontend application
│   ├── src/
│   │   ├── App.svelte         # Main application component
│   │   ├── main.ts            # Application entry point
│   │   ├── components/        # Svelte components
│   │   │   ├── WelcomeScreen.svelte
│   │   │   └── RoomScreen.svelte
│   │   └── lib/               # TypeScript modules
│   │       ├── stores.ts      # Svelte stores for state management
│   │       ├── webrtc-simple.ts  # WebRTC peer connection handling
│   │       ├── signalling.ts  # WebSocket communication
│   │       └── types.ts       # TypeScript interfaces
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── server/                     # Node.js signalling server
│   ├── signalling-server.ts   # WebSocket server implementation
│   ├── types.ts              # Server-side message interfaces
│   ├── package.json
│   └── tsconfig.json
├── tests/                      # Test suites
│   ├── client/               # Client-side tests
│   └── server/               # Server-side tests
├── package.json              # Root package.json with workspace scripts
└── CLAUDE.md                 # Development guidelines
```

### Communication Flow

1. **Room Creation/Joining**: WebSocket connection to signalling server
2. **WebRTC Handshake**: Server relays offers, answers, and ICE candidates
3. **P2P Establishment**: Direct WebRTC data channels between all participants
4. **Game State Sync**: Voting and room state flows peer-to-peer
5. **Real-time Updates**: Reactive UI updates via Svelte stores

### State Management

- **Client State**: Centralized in Svelte stores with reactive updates
- **P2P Synchronization**: Game state synchronized via WebRTC data channels
- **Server State**: Minimal room-to-client mappings for signalling only
- **Type Safety**: Comprehensive TypeScript interfaces across all components

## Available Scripts

### Root Level Commands
- `npm run test` - Run all tests across the project
- `npm run test:run` - Run tests once without watch mode
- `npm run test:coverage` - Run tests with coverage reporting
- `npm run test:ui` - Run tests with visual UI
- `npm run client:dev` - Start client development server
- `npm run client:build` - Build client for production
- `npm run server:start` - Start signalling server

### Client Commands (from `/client` directory)
- `npm run dev` - Development server with hot reload on port 8080
- `npm run build` - Build optimized production bundle
- `npm run start` - Build and serve with Vite preview
- `npm run test` - Run client tests with Vitest
- `npm run test:coverage` - Run client tests with coverage

### Server Commands (from `/server` directory)
- `npm run start` - Compile TypeScript and start with nodemon
- `npm run build` - Compile TypeScript only
- `npm run test` - Run server tests
- `npm run test:coverage` - Run server tests with coverage

## Usage

### Creating a Room

1. Enter your name on the welcome screen
2. Click "Create Room"
3. Share the generated room ID with your team
4. Wait for participants to join

### Joining a Room

1. Enter your name on the welcome screen
2. Enter the room ID provided by your host
3. Click "Join Room"
4. Start voting when prompted by the host

### Voting Process

1. **Select a Card**: Choose from planning poker cards (1, 2, 3, 5, 8, 13, ?)
2. **Wait for Others**: All participants must vote before results are revealed
3. **Reveal Votes**: Host can reveal all votes simultaneously
4. **Discuss**: Team discusses the estimation results
5. **New Round**: Host can start a new voting round

## Testing

### Running All Tests

```bash
# Run all tests once
npm run test:run

# Run tests in watch mode
npm run test

# Run with coverage report
npm run test:coverage

# Visual test UI
npm run test:ui
```

### Test Coverage

- **Client Tests**: Svelte components, WebRTC connections, state management
- **Server Tests**: WebSocket messaging, room management, error handling
- **Integration Tests**: End-to-end communication flow
- **Type Tests**: TypeScript interface validation

## Configuration

### WebRTC STUN/TURN Servers

Modify `client/src/lib/webrtc-simple.ts` to use custom STUN/TURN servers:

```typescript
const configuration: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:your-stun-server.com:19302' },
        { 
            urls: 'turn:your-turn-server.com:3478',
            username: 'your-username',
            credential: 'your-password'
        }
    ]
};
```

### Server Port

Set custom server port via environment variable:

```bash
PORT=3001 npm run server:start
```

### Tailwind CSS Customization

Modify `client/tailwind.config.js` for custom styling:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#your-primary-color',
        secondary: '#your-secondary-color',
      },
    },
  },
};
```

## Deployment

### Static Hosting (Client)

After building the client (`npm run client:build`), deploy the `client/dist/` folder to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Server Hosting

Deploy the Node.js server to platforms like:

- Heroku
- Railway
- AWS EC2
- DigitalOcean
- Google Cloud Run

Ensure WebSocket support is enabled on your hosting platform.

## Troubleshooting

### Common Issues

**WebRTC Connection Problems**
- Check browser console for errors
- Verify STUN/TURN server configuration
- Ensure signalling server is accessible
- Test with different network configurations

**Server Connection Failed**
- Verify server is running on correct port
- Check firewall settings
- Ensure WebSocket support in hosting environment

**Build Errors**
- Clear dependencies: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf client/node_modules/.vite`
- Check TypeScript errors: `npm run client:build`

**Hot Reload Not Working**
- Restart development server: `npm run client:dev`
- Check for syntax errors in components
- Verify Vite configuration

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes following the existing code style
4. Run tests: `npm run test:run`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

### Development Guidelines

- Follow TypeScript strict mode conventions
- Write tests for new features
- Use Svelte reactive patterns for UI updates
- Maintain WebRTC connection stability
- Follow existing code organization patterns

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **WebRTC** for enabling peer-to-peer communication
- **Planning Poker** estimation technique
- **Svelte** for reactive UI framework
- **Vite** for fast development and build tooling
- **Tailwind CSS** for utility-first styling