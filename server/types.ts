import { WebSocket } from 'ws';

/**
 * Represents a connected client on the signalling server
 */
export interface Client {
    /** The WebSocket connection for this client */
    ws: WebSocket;
    /** The room ID this client is currently in */
    roomId: string;
}

/**
 * Message types that the signalling server can handle
 */
export type ServerMessageType = 
    | 'create-room'
    | 'join-room'
    | 'offer'
    | 'answer'
    | 'ice-candidate'
    | 'new-peer'
    | 'peer-disconnected'
    | 'error';

/**
 * Base interface for all server messages
 */
export interface BaseServerMessage {
    /** The type of message */
    type: ServerMessageType;
    /** Username of the message sender */
    username: string;
}

/**
 * Message to request room creation
 */
export interface CreateRoomRequest extends BaseServerMessage {
    type: 'create-room';
}

/**
 * Response sent when a room is successfully created
 */
export interface RoomCreatedResponse {
    type: 'room-created';
    /** The generated room ID */
    roomId: string;
}

/**
 * Message to request joining a room
 */
export interface JoinRoomRequest extends BaseServerMessage {
    type: 'join-room';
    /** The room ID to join */
    roomId: string;
}

/**
 * Response sent when successfully joined a room
 */
export interface RoomJoinedResponse {
    type: 'room-joined';
    /** The room ID that was joined */
    roomId: string;
    /** List of existing participants */
    participants: string[];
}

/**
 * WebRTC offer message for peer connection establishment
 */
export interface OfferMessage extends BaseServerMessage {
    type: 'offer';
    /** Username of the sender */
    from: string;
    /** ID of the target peer */
    peerId: string;
    /** The WebRTC offer session description */
    offer: RTCSessionDescriptionInit;
}

/**
 * WebRTC answer message for peer connection establishment
 */
export interface AnswerMessage extends BaseServerMessage {
    type: 'answer';
    /** Username of the sender */
    from: string;
    /** ID of the target peer */
    peerId: string;
    /** The WebRTC answer session description */
    answer: RTCSessionDescriptionInit;
}

/**
 * WebRTC ICE candidate message for network connectivity
 */
export interface IceCandidateMessage extends BaseServerMessage {
    type: 'ice-candidate';
    /** Username of the sender */
    from: string;
    /** ID of the target peer */
    peerId: string;
    /** The ICE candidate information */
    candidate: RTCIceCandidateInit;
}

/**
 * Message sent when a new peer joins the room
 */
export interface NewPeerMessage extends BaseServerMessage {
    type: 'new-peer';
}

/**
 * Message sent when a peer disconnects from the room
 */
export interface PeerDisconnectedMessage extends BaseServerMessage {
    type: 'peer-disconnected';
}

/**
 * Error message sent by the server
 */
export interface ErrorMessage {
    type: 'error';
    /** The error message text */
    message: string;
}

/**
 * Union type for all possible server request messages
 */
export type ServerMessage =
    | CreateRoomRequest
    | JoinRoomRequest
    | OfferMessage
    | AnswerMessage
    | IceCandidateMessage
    | NewPeerMessage
    | PeerDisconnectedMessage
    | ErrorMessage;

/**
 * Union type for all possible server response messages
 */
export type ServerResponse =
    | RoomCreatedResponse
    | RoomJoinedResponse
    | NewPeerMessage
    | PeerDisconnectedMessage
    | ErrorMessage;
