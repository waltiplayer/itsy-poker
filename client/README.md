# ItsyPoker Client - Planning Poker Frontend

The client application for ItsyPoker is a modern web-based frontend built with **Svelte**, **Vite**, and **Tailwind CSS**. It provides a streamlined user interface for planning poker sessions with real-time peer-to-peer communication using WebRTC.

## Features

- Create and join planning poker sessions
- Real-time peer-to-peer communication using WebRTC
- Support for 2-10 participants per room
- Standard planning poker cards (1, 2, 3, 5, 8, 13, ?)
- Host controls for revealing votes and starting new rounds
- Modern, responsive design built with Tailwind CSS
- Component-based architecture with Svelte
- Fast development and build process with Vite

## Tech Stack

- **Framework**: Svelte 5 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3
- **Testing**: Vitest
- **WebRTC**: Native browser APIs for peer-to-peer communication

## Client Architecture

### File Structure

```
client/
├── index.html                 # Main entry point
├── src/
│   ├── App.svelte            # Root Svelte component
│   ├── main.ts               # Application entry point
│   ├── app.css               # Tailwind CSS imports and custom styles
│   ├── components/           # Svelte components
│   │   ├── WelcomeScreen.svelte
│   │   └── RoomScreen.svelte
│   └── lib/                  # TypeScript modules
│       ├── stores.ts         # Svelte stores for state management
│       ├── webrtc-simple.ts  # WebRTC peer connection handling
│       ├── signalling.ts     # WebSocket communication with signalling server
│       ├── ui.ts             # Legacy UI utilities (being phased out)
│       └── types.ts          # TypeScript interfaces and type definitions
├── dist/                     # Vite build output
├── package.json              # Dependencies and build scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
└── svelte.config.js          # Svelte configuration
```

### Application Flow

1. **Initialization**: Svelte app loads, WebRTC initialized
2. **Welcome Screen**: User enters name and creates/joins room
3. **Signalling**: WebSocket connection established with signalling server
4. **Room Management**: State managed through Svelte stores
5. **WebRTC Setup**: Peer connections established via signalling server
6. **Game State**: Planning poker data flows directly between peers
7. **Reactive UI**: Svelte components automatically update based on store changes

### State Management

The application uses **Svelte stores** for reactive state management:

- **`appState`**: Central store containing room info, participants, votes, and WebRTC channels
- **`handlePeerData`**: Function to process incoming peer messages and update state
- **Reactive Components**: Svelte components automatically re-render when store data changes

## Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)

## Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

### Development Mode (Recommended)

Start the Vite development server with hot module replacement:

```bash
npm run dev
```

This will:
- Start Vite dev server on port 8080 (or next available port)
- Enable hot module replacement for instant updates
- Serve the app with TypeScript compilation and Tailwind CSS processing

### Building the Client

Create an optimized production build:

```bash
npm run build
```

This creates an optimized bundle in the `dist/` directory with:
- Minified JavaScript and CSS
- Asset optimization
- Tree-shaking for smaller bundle sizes

### Production Preview

Build and preview the production version locally:

```bash
npm run start
```

This builds the project and serves it using Vite's preview server.

## Running the Client

### Prerequisites

1. **Signalling Server**: Ensure the signalling server is running (see `../server/README.md`)
2. **Dependencies**: Install client dependencies (`npm install`)

### Quick Start

#### Development Mode (Recommended)

```bash
# Start development server with hot reload
npm run dev
```

The development server will start on `http://localhost:8080` (or next available port) with:
- Hot module replacement for instant updates
- Source maps for debugging
- Tailwind CSS compilation
- TypeScript type checking

#### Production Mode

```bash
# Build and serve production version
npm run start
```

### Manual Deployment

After building (`npm run build`), you can serve the `dist/` folder using any static file server:

```bash
# Using Vite preview
npm run start

# Using serve (if installed globally)
serve dist

# Using Python
python -m http.server 8080 -d dist

# Using Node.js http-server
npx http-server dist -p 8080
```

### Access the Application

Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:8080`).

## Usage

1. **Create a Room**:
   - Enter your name
   - Click "Create Room"
   - Share the room ID or link with your team

2. **Join a Room**:
   - Enter your name
   - Enter the room ID
   - Click "Join Room"

3. **Voting**:
   - Select a card to cast your vote
   - The host can reveal votes when everyone has voted
   - The host can start a new round

## Development

### Testing

The client includes comprehensive unit tests using Vitest.

#### Running Client Tests

From the client directory:

```bash
# Run tests in watch mode
npm run test

# Run tests once and exit
npm run test:run

# Run with coverage report
npm run test:coverage

# Visual test UI
npm run test:ui
```

#### Client Test Files

Located in `../tests/client/`:

- **`types.test.ts`** - TypeScript interfaces and type validation
- **`app.test.ts`** - Application logic and state management  
- **`webrtc.test.ts`** - WebRTC connection handling
- **`signalling.test.ts`** - WebSocket signalling communication
- **`ui.test.ts`** - UI components and interactions

#### Test Environment

Client tests use Happy DOM for browser environment simulation and include mocking for:
- WebRTC APIs (RTCPeerConnection, RTCDataChannel)
- WebSocket connections
- Svelte component interactions

### Code Organization

#### Svelte Components

- **`App.svelte`** - Root component managing application state and screen navigation
- **`WelcomeScreen.svelte`** - Room creation and joining interface
- **`RoomScreen.svelte`** - Main planning poker interface with voting and results

#### TypeScript Modules

- **`stores.ts`** - Svelte stores for reactive state management
- **`webrtc-simple.ts`** - WebRTC peer connection setup and data channel management
- **`signalling.ts`** - WebSocket communication with signalling server
- **`types.ts`** - Shared TypeScript interfaces for type safety
- **`ui.ts`** - Legacy UI utilities (being phased out in favor of Svelte components)

#### State Management

The client uses **Svelte stores** for reactive state management:

- **Centralized State**: `appState` store contains all application state
- **Reactive Updates**: Components automatically re-render when state changes
- **Type Safety**: Full TypeScript support with proper type definitions
- **Immutable Updates**: State updates follow immutable patterns

#### Message Flow

1. **WebSocket Messages**: Room management and WebRTC signalling via `signalling.ts`
2. **WebRTC Data**: Direct peer-to-peer game state synchronization
3. **Store Updates**: State changes propagated through Svelte stores
4. **Component Re-renders**: UI automatically updates based on store changes

### WebRTC Configuration

The client uses Google's STUN servers for NAT traversal. To use different STUN/TURN servers, modify the configuration in `src/lib/webrtc-simple.ts`:

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

### Customization

#### Tailwind CSS

Customize the design by modifying `tailwind.config.js`:

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

#### Svelte Components

Components are located in `src/components/` and can be easily customized or extended. The application uses Tailwind CSS classes for styling, making it easy to modify the appearance.

### Troubleshooting

#### Common Issues

**Vite Build Errors**
- Ensure all dependencies are installed: `npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check for TypeScript errors: `npm run build`

**Tailwind CSS Not Working**
- Verify PostCSS configuration in `postcss.config.js`
- Check Tailwind config in `tailwind.config.js`
- Ensure CSS imports are correct in `src/app.css`

**Svelte Component Issues**
- Check browser console for component errors
- Verify store imports and usage
- Ensure reactive statements (`$:`) are properly formatted

**WebRTC Connection Issues**
- Check browser developer console for errors
- Ensure signalling server is running and accessible
- Verify STUN/TURN server configuration
- Test with different network configurations

**Hot Module Replacement Not Working**
- Restart the development server: `npm run dev`
- Check for syntax errors in components
- Verify Vite configuration in `vite.config.ts`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- WebRTC for enabling peer-to-peer communication
- Planning Poker for the estimation technique
