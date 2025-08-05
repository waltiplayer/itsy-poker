# Root Directory Structure

ItsyPoker/
├── index.html
├── styles/
│   └── main.css
├── scripts/
│   ├── app.ts
│   ├── webrtc.ts
│   ├── signalling.ts
│   └── ui.ts
├── assets/
│   └── (icons, images, etc.)
├── README.md
├── requirements.md
├── project-structure.md
└── server/
└── signalling-server.ts

# File/Folder Descriptions
index.html
Entry point of the app.

Loads the CSS and JavaScript files.

Contains minimal markup and a placeholder <div id="app"> or similar.

📁 styles/
main.css
Core styles for layout, cards, buttons, vote indicators, etc.

May include responsive design rules and theme options.

📁 scripts/
app.ts
Main application logic and orchestration.

Handles session creation, joins, and high-level game state transitions.

webrtc.ts
Contains WebRTC logic:

RTCPeerConnection setup

RTCDataChannel management

ICE candidate handling

signalling.ts
Manages signalling logic:

Connects to signalling server (WebSocket or Firebase)

Sends and receives offers/answers/ICE candidates

ui.ts
Updates DOM based on app state:

Renders vote cards, player list, round controls

Handles user input (name, card selection, etc.)

Reflects vote status and reveals

📁 assets/
Static files like:

SVG icons for cards

Favicon

Sounds (optional)

📄 README.md
Project overview, setup instructions, and development notes.

📄 requirements.md
Functional and non-functional specifications (as previously written).

📄 project-structure.md
This file! Explains project layout.

📁 server/
signalling-server.ts
Node.js WebSocket server (or Firebase config script) for signalling.

Handles:

Room creation

Client connection management

Offer/answer and ICE relay

🧪 Development Suggestions
Use a simple static file server like live-server or vite during development.

For signalling, a free Glitch, Heroku, or Railway WebSocket server will work.

Keep everything in ES Modules (type="module") for clarity and maintainability.

