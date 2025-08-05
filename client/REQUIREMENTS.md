Functional Requirements
1. Room Creation and Joining
   A user can create a new planning session (room).

The app generates a unique room ID (e.g. UUID or short token).

Other users can join the room by entering the room ID or using a shared link.

The room supports 2–10 participants.

2. WebRTC Peer-to-Peer Connection
   A simple signalling mechanism (e.g. WebSocket or Firebase) is used for:

Exchanging SDP offers/answers

Sharing ICE candidates

Once established, all game communication is handled via RTCDataChannel.

Connections should be peer-to-peer, without relaying data through a central server after signalling.

3. User Identity and Roles
   Upon joining, each user enters a display name.

The first user in the room is the host and can:

Start or reset voting rounds

Reveal votes

4. Poker Voting
   Each user sees a list of standard poker cards (e.g. 1, 2, 3, 5, 8, 13, ?).

Users can:

Select a card to vote

Change their vote before the reveal

Once all users have voted (or the host chooses to reveal), votes are shown.

5. Round Management
   The host can:

Start a new round (clears all votes)

Reveal votes

Each user can see the round status: waiting for votes, revealed, new round started

6. User Presence
   Users see a list of participants in the room with:

Display name

Whether they've voted

Their vote (after reveal)

Users joining late receive the current state of the round

Non-Functional Requirements
A. Platform & Hosting
Hosted as a static site (e.g. GitHub Pages, Netlify, Vercel)

No backend API is required other than the signalling service

B. Performance
Connection time for joining a room should be under 2 seconds

Latency between peers should be under 250ms

C. Security
No sensitive data is exchanged or stored

All communication over secure WebRTC/HTTPS/WSS

Prevent users from joining without a name

D. Reliability
If a peer disconnects, the UI should reflect that

Peer reconnection should be handled gracefully if supported by the signalling service

Technical Requirements
Web Frontend
HTML, CSS, JavaScript (framework optional)

WebRTC APIs:

RTCPeerConnection

RTCDataChannel

Optional UI framework (e.g. Svelte, React, or none)

Signalling Server
Handles exchange of:

SDP offers/answers

ICE candidates

Options:

Node.js + WebSocket server (custom or using Socket.IO)

Firebase Realtime Database or Firestore

Should support minimal traffic and low latency

Nice-to-Have Features (Future Enhancements)
Emoji reactions or chat during sessions

Export results to CSV or copy to clipboard

Dark/light mode toggle

Sound effects for vote reveal

Basic authentication to lock rooms

Persistent room state using IndexedDB or Firebase

Out of Scope
Authentication via email/social login

Backend logic for task estimation or ticket integration

AI-based vote suggestions or analysis
