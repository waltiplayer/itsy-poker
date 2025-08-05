# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ItsyPoker is a web-based planning poker application using WebRTC for peer-to-peer communication. The project is built with Svelte frontend and a Node.js WebSocket signalling server, using modern TypeScript and Vite for development.

## Development Commands

### Root-level commands
- `npm run test` - Run all tests across the project
- `npm run test:run` - Run tests once without watch mode
- `npm run test:coverage` - Run tests with coverage reporting
- `npm run test:ui` - Run tests with visual UI
- `npm run client:dev` - Start client development server
- `npm run client:build` - Build client for production
- `npm run server:start` - Start signalling server

### Client (from `/client` directory)
- `npm run build` - Build client with Vite
- `npm run start` - Build and serve with Vite preview
- `npm run dev` - Development mode with Vite dev server on port 8080
- `npm run test` - Run client tests with Vitest
- `npm run test:run` - Run client tests once
- `npm run test:coverage` - Run client tests with coverage
- `npm run test:ui` - Run client tests with UI

### Server (from `/server` directory)  
- `npm run start` - Compile TypeScript and start with nodemon (auto-restart)
- `npm run build` - Compile TypeScript only
- `npm run test` - Run server tests with Vitest
- `npm run test:run` - Run server tests once
- `npm run test:coverage` - Run server tests with coverage
- `npm run test:ui` - Run server tests with UI

### Full Development Setup
1. Start signalling server: `cd server && npm run start`
2. Start client dev server: `cd client && npm run dev`
3. Access application at `http://localhost:8080`

## Architecture

### Client-Server Communication Flow
1. **Signalling Phase**: WebSocket connection to signalling server for room management and WebRTC handshake
2. **P2P Phase**: Direct WebRTC data channels between participants for real-time game state

### Key Components

**Client (`/client/src/`)**:
- `App.svelte` - Main Svelte application component
- `main.ts` - Application entry point and initialization
- `components/WelcomeScreen.svelte` - Landing page for creating/joining rooms
- `components/RoomScreen.svelte` - Main planning poker interface
- `lib/types.ts` - Comprehensive TypeScript interfaces for client and server communication
- `lib/stores.ts` - Svelte stores for global state management with reactive updates
- `lib/signalling.ts` - WebSocket communication with signalling server
- `lib/webrtc-simple.ts` - WebRTC peer connection and data channel handling

**Server (`/server/`)**:
- `signalling-server.ts` - WebSocket server for room management and WebRTC signalling relay
- `types.ts` - Server-side message interfaces

### Frontend Architecture
- **Framework**: Svelte 5 with TypeScript for reactive UI components
- **Build System**: Vite with hot module replacement and optimized bundling
- **Styling**: Tailwind CSS with PostCSS processing
- **State Management**: Svelte writable stores with reactive state updates
- **Module Resolution**: Path aliases (`@/` for src directory) for clean imports

### State Management
- **Reactive Stores**: Svelte stores in `stores.ts` provide reactive state management
- **AppState Interface**: Centralized state with room info, participants, votes, and WebRTC channels
- **Message Handling**: `handlePeerData` function processes incoming peer messages and updates state
- **Server State**: Room-to-client mappings for WebSocket message routing
- **P2P Synchronization**: Game state synchronized via WebRTC data channels after connection

### Testing Infrastructure
- **Test Framework**: Vitest for both client and server with TypeScript support
- **Test Environment**: Happy-dom for client-side DOM testing, Node.js for server
- **Coverage**: Built-in coverage reporting with multiple output formats
- **Test Organization**: Separate test directories for client and server components
- **UI Testing**: Vitest UI for interactive test running and debugging

### TypeScript Configuration
- **Modern ES2020**: Both client and server use ES2020 modules with bundler resolution
- **Strict Mode**: Comprehensive type checking with strict compiler options
- **Source Maps**: Full source map generation for debugging in development
- **Path Mapping**: Alias support for clean imports (`@/*` → `./src/*`)
- **Svelte Integration**: Full TypeScript support for Svelte components via @tsconfig/svelte

### Type System Architecture
- **Message Types**: Strongly typed union types for WebRTC data messages and WebSocket signalling
- **Planning Poker Cards**: `PokerCard` type ensures only valid card values ('1', '2', '3', '5', '8', '13', '?')
- **State Management**: `AppState` interface centralizes all client-side state with proper nullability
- **Signalling Messages**: Complete type coverage for WebSocket communication patterns
- **Runtime Safety**: Type guards and comprehensive error handling for network operations

## WebRTC Architecture Notes

The application uses a hybrid approach:
- **Centralized signalling**: WebSocket server handles room creation, joining, and WebRTC handshake
- **Decentralized game data**: Once WebRTC connections established, all voting/game state flows peer-to-peer
- **Mesh Topology**: Each participant maintains direct connections to all other peers in the room
- **State Synchronization**: New participants receive current state via WebRTC data channels