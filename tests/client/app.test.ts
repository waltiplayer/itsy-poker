import { describe, it, expect, beforeEach, vi } from 'vitest'
import { handlePeerData, state } from '../../client/scripts/app'
import type { DataMessage } from '../../client/scripts/types'

// Mock WebRTC APIs
global.RTCPeerConnection = vi.fn().mockImplementation(() => ({
  createDataChannel: vi.fn(),
  setLocalDescription: vi.fn(),
  setRemoteDescription: vi.fn(),
  addIceCandidate: vi.fn(),
  createOffer: vi.fn(),
  createAnswer: vi.fn(),
  close: vi.fn(),
  onicecandidate: null,
  ondatachannel: null,
  onconnectionstatechange: null,
  connectionState: 'new',
  localDescription: null,
  remoteDescription: null,
}))

global.RTCSessionDescription = vi.fn().mockImplementation((init) => init)
global.RTCIceCandidate = vi.fn().mockImplementation((init) => init)

// Mock WebSocket
global.WebSocket = vi.fn().mockImplementation(() => ({
  send: vi.fn(),
  close: vi.fn(),
  onopen: null,
  onmessage: null,
  onclose: null,
  onerror: null,
  readyState: WebSocket.CONNECTING,
}))

// Mock dependencies
vi.mock('../../client/scripts/webrtc.js', () => ({
  initWebRTC: vi.fn(),
  sendData: vi.fn()
}))

vi.mock('../../client/scripts/signalling.js', () => ({
  connectToSignallingServer: vi.fn(),
  createRoom: vi.fn().mockResolvedValue('room123'),
  joinRoom: vi.fn()
}))

vi.mock('../../client/scripts/ui.js', () => ({
  showScreen: vi.fn(),
  updateParticipantsList: vi.fn(),
  updateVoteStatus: vi.fn(),
  showResults: vi.fn()
}))

describe('App', () => {
  beforeEach(() => {
    // Reset state before each test
    state.roomId = null
    state.isHost = false
    state.username = ''
    state.participants = {}
    state.currentVote = null
    state.revealedVotes = false
    state.dataChannels = {}
    
    vi.clearAllMocks()
  })

  describe('handlePeerData', () => {
    it('should handle join messages', () => {
      const joinMessage: DataMessage = {
        type: 'join',
        username: 'newuser'
      }

      handlePeerData(joinMessage)

      expect(state.participants['newuser']).toEqual({
        username: 'newuser',
        isHost: false,
        hasVoted: false,
        vote: null
      })
    })

    it('should handle vote messages', () => {
      // Set up initial participant
      state.participants['testuser'] = {
        username: 'testuser',
        isHost: false,
        hasVoted: false,
        vote: null
      }

      const voteMessage: DataMessage = {
        type: 'vote',
        username: 'testuser',
        hasVoted: true,
        vote: '5'
      }

      handlePeerData(voteMessage)

      expect(state.participants['testuser'].hasVoted).toBe(true)
      expect(state.participants['testuser'].vote).toBe('5')
    })

    it('should handle reveal messages', () => {
      const revealMessage: DataMessage = {
        type: 'reveal'
      }

      handlePeerData(revealMessage)

      expect(state.revealedVotes).toBe(true)
    })

    it('should handle newRound messages', () => {
      // Set up initial state with votes
      state.revealedVotes = true
      state.currentVote = '3'
      state.participants['user1'] = {
        username: 'user1',
        isHost: false,
        hasVoted: true,
        vote: '5'
      }
      state.participants['user2'] = {
        username: 'user2',
        isHost: false,
        hasVoted: true,
        vote: '8'
      }

      const newRoundMessage: DataMessage = {
        type: 'newRound'
      }

      handlePeerData(newRoundMessage)

      expect(state.revealedVotes).toBe(false)
      expect(state.currentVote).toBe(null)
      expect(state.participants['user1'].hasVoted).toBe(false)
      expect(state.participants['user1'].vote).toBe(null)
      expect(state.participants['user2'].hasVoted).toBe(false)
      expect(state.participants['user2'].vote).toBe(null)
    })

    it('should handle state messages', () => {
      const stateMessage: DataMessage = {
        type: 'state',
        participants: {
          'host': { username: 'host', isHost: true, hasVoted: true, vote: '13' },
          'user1': { username: 'user1', isHost: false, hasVoted: false, vote: null }
        },
        revealedVotes: true
      }

      handlePeerData(stateMessage)

      expect(state.participants).toEqual(stateMessage.participants)
      expect(state.revealedVotes).toBe(true)
    })

    it('should ignore vote messages for non-existent participants', () => {
      const voteMessage: DataMessage = {
        type: 'vote',
        username: 'nonexistent',
        hasVoted: true,
        vote: '5'
      }

      expect(() => handlePeerData(voteMessage)).not.toThrow()
      expect(state.participants['nonexistent']).toBeUndefined()
    })

    it('should handle join messages with missing username gracefully', () => {
      const joinMessage: DataMessage = {
        type: 'join',
        username: ''
      }

      handlePeerData(joinMessage)

      expect(state.participants['']).toBeUndefined()
    })
  })

  describe('state management', () => {
    it('should initialize with correct default values', () => {
      expect(state.roomId).toBe(null)
      expect(state.isHost).toBe(false)
      expect(state.username).toBe('')
      expect(state.participants).toEqual({})
      expect(state.currentVote).toBe(null)
      expect(state.revealedVotes).toBe(false)
      expect(state.dataChannels).toEqual({})
    })

    it('should allow state modifications', () => {
      state.roomId = 'test123'
      state.isHost = true
      state.username = 'testuser'
      
      expect(state.roomId).toBe('test123')
      expect(state.isHost).toBe(true)
      expect(state.username).toBe('testuser')
    })
  })
})