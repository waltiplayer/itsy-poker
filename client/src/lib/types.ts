/**
 * Represents the main application state for the ItsyPoker client
 */
export interface AppState {
    /** The current room identifier, null if not in a room */
    roomId: string | null;
    /** Whether the current user is the host of the room */
    isHost: boolean;
    /** The current user's display name */
    username: string;
    /** Map of usernames to participant data */
    participants: Record<string, Participant>;
    /** The current user's selected vote value */
    currentVote: string | null;
    /** Whether votes have been revealed in the current round */
    revealedVotes: boolean;
    /** Map of peer IDs to their WebRTC data channels */
    dataChannels: Record<string, RTCDataChannel>;
}

/**
 * Represents a participant in a planning poker session
 */
export interface Participant {
    /** The participant's display name */
    username: string;
    /** Whether this participant is the host of the room */
    isHost: boolean;
    /** Whether the participant has cast a vote in the current round */
    hasVoted: boolean;
    /** The participant's vote value, null if not voted or not revealed */
    vote: string | null;
}

/**
 * Valid planning poker card values
 */
export type PokerCard = '1' | '2' | '3' | '5' | '8' | '13' | '?';

/**
 * Message types for peer-to-peer communication via WebRTC data channels
 */
export type DataMessageType = 'join' | 'vote' | 'reveal' | 'newRound' | 'state' | 'participantJoined' | 'participantLeft';

/**
 * Base interface for all WebRTC data channel messages
 */
export interface BaseDataMessage {
    /** The type of message being sent */
    type: DataMessageType;
}

/**
 * Message sent when a participant joins the room
 */
export interface JoinMessage extends BaseDataMessage {
    type: 'join';
    /** The username of the joining participant */
    username: string;
}

/**
 * Message sent when a participant casts a vote
 */
export interface VoteMessage extends BaseDataMessage {
    type: 'vote';
    /** The username of the voting participant */
    username: string;
    /** Whether the participant has voted */
    hasVoted: boolean;
    /** The vote value */
    vote: PokerCard | null;
}

/**
 * Message sent by host to reveal all votes
 */
export interface RevealMessage extends BaseDataMessage {
    type: 'reveal';
}

/**
 * Message sent by host to start a new round
 */
export interface NewRoundMessage extends BaseDataMessage {
    type: 'newRound';
}

/**
 * Message sent to synchronize state with new participants
 */
export interface StateMessage extends BaseDataMessage {
    type: 'state';
    /** Current participants in the room */
    participants: Record<string, Participant>;
    /** Whether votes are currently revealed */
    revealedVotes: boolean;
}

/**
 * Message sent when a participant joins the room
 */
export interface ParticipantJoinedMessage extends BaseDataMessage {
    type: 'participantJoined';
    /** The username of the joining participant */
    username: string;
}

/**
 * Message sent when a participant leaves the room
 */
export interface ParticipantLeftMessage extends BaseDataMessage {
    type: 'participantLeft';
    /** The username of the leaving participant */
    username: string;
}

/**
 * Union type for all possible data channel messages
 */
export type DataMessage = JoinMessage | VoteMessage | RevealMessage | NewRoundMessage | StateMessage | ParticipantJoinedMessage | ParticipantLeftMessage;

/**
 * Message types for WebSocket signalling communication
 */
export type SignallingMessageType = 
    | 'create-room'
    | 'join-room'
    | 'room-created'
    | 'room-joined'
    | 'offer'
    | 'answer'
    | 'ice-candidate'
    | 'new-peer'
    | 'peer-disconnected'
    | 'error';

/**
 * Base interface for all signalling messages
 */
export interface BaseSignallingMessage {
    /** The type of signalling message */
    type: SignallingMessageType;
}

/**
 * Message to create a new room
 */
export interface CreateRoomMessage extends BaseSignallingMessage {
    type: 'create-room';
    /** Username of the room creator */
    username: string;
}

/**
 * Message to join an existing room
 */
export interface JoinRoomMessage extends BaseSignallingMessage {
    type: 'join-room';
    /** The room ID to join */
    roomId: string;
    /** Username of the joining participant */
    username: string;
}

/**
 * Response when a room is successfully created
 */
export interface RoomCreatedMessage extends BaseSignallingMessage {
    type: 'room-created';
    /** The generated room ID */
    roomId: string;
}

/**
 * Response when successfully joined a room
 */
export interface RoomJoinedMessage extends BaseSignallingMessage {
    type: 'room-joined';
    /** The room ID that was joined */
    roomId: string;
    /** List of existing participants in the room */
    participants: string[];
}

/**
 * WebRTC offer message
 */
export interface OfferMessage extends BaseSignallingMessage {
    type: 'offer';
    /** The WebRTC offer */
    offer: RTCSessionDescriptionInit;
    /** ID of the peer this offer is for */
    peerId: string;
    /** Username of the sender */
    from: string;
}

/**
 * WebRTC answer message
 */
export interface AnswerMessage extends BaseSignallingMessage {
    type: 'answer';
    /** The WebRTC answer */
    answer: RTCSessionDescriptionInit;
    /** ID of the peer this answer is for */
    peerId: string;
    /** Username of the sender */
    from: string;
}

/**
 * WebRTC ICE candidate message
 */
export interface IceCandidateMessage extends BaseSignallingMessage {
    type: 'ice-candidate';
    /** The ICE candidate */
    candidate: RTCIceCandidateInit;
    /** ID of the peer this candidate is for */
    peerId: string;
    /** Username of the sender */
    from: string;
}

/**
 * Message indicating a new peer joined
 */
export interface NewPeerMessage extends BaseSignallingMessage {
    type: 'new-peer';
    /** Username of the new peer */
    username: string;
}

/**
 * Message indicating a peer disconnected
 */
export interface PeerDisconnectedMessage extends BaseSignallingMessage {
    type: 'peer-disconnected';
    /** Username of the disconnected peer */
    username: string;
}

/**
 * Error message from server
 */
export interface ErrorMessage extends BaseSignallingMessage {
    type: 'error';
    /** Error message text */
    message: string;
}

/**
 * Union type for all possible signalling messages
 */
export type SignallingMessage = 
    | CreateRoomMessage
    | JoinRoomMessage
    | RoomCreatedMessage
    | RoomJoinedMessage
    | OfferMessage
    | AnswerMessage
    | IceCandidateMessage
    | NewPeerMessage
    | PeerDisconnectedMessage
    | ErrorMessage;
