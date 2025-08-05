import { describe, it, expect, beforeEach, vi } from 'vitest'
import { initWebRTC, createPeerConnection, sendData, sendDataToPeer } from '../../client/scripts/webrtc'
import { state } from '../../client/scripts/app'

// Mock WebRTC APIs
global.RTCPeerConnection = vi.fn().mockImplementation(() => ({
  createDataChannel: vi.fn().mockReturnValue({
    onopen: null,
    onclose: null,
    onmessage: null,
    onerror: null,
    send: vi.fn(),
    close: vi.fn(),
    readyState: 'connecting'
  }),
  setLocalDescription: vi.fn(),
  setRemoteDescription: vi.fn(),
  addIceCandidate: vi.fn(),
  createOffer: vi.fn(),
  createAnswer: vi.fn(),
  close: vi.fn(),
  addEventListener: vi.fn(),
  onicecandidate: null,
  ondatachannel: null,
  onconnectionstatechange: null,
  connectionState: 'new',
  localDescription: null,
  remoteDescription: null,
}))

global.RTCSessionDescription = vi.fn().mockImplementation((init) => init)
global.RTCIceCandidate = vi.fn().mockImplementation((init) => init)

// Mock console to avoid noise in tests
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

describe('WebRTC', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initWebRTC', () => {
    it('should initialize WebRTC and log status', () => {
      initWebRTC()
      
      expect(consoleSpy).toHaveBeenCalledWith('Initializing WebRTC...')
    })
  })

  describe('createPeerConnection', () => {
    it('should create a peer connection for initiator', () => {
      const peerId = 'peer123'
      const peerConnection = createPeerConnection(peerId, true)
      
      expect(peerConnection).toBeDefined()
      expect(peerConnection.createDataChannel).toBeDefined()
    })

    it('should create a peer connection for non-initiator', () => {
      const peerId = 'peer456'
      const peerConnection = createPeerConnection(peerId, false)
      
      expect(peerConnection).toBeDefined()
      expect(peerConnection.createDataChannel).toBeDefined()
    })

    it('should log peer connection creation', () => {
      const peerId = 'peer789'
      createPeerConnection(peerId, true)
      
      expect(consoleSpy).toHaveBeenCalledWith(`Creating peer connection for ${peerId}, initiator: true`)
    })

    it('should create data channel when initiator is true', () => {
      const mockDataChannel = {
        onopen: null,
        onclose: null,
        onmessage: null,
        onerror: null,
        send: vi.fn(),
        close: vi.fn(),
        readyState: 'connecting'
      }
      const mockCreateDataChannel = vi.fn().mockReturnValue(mockDataChannel)
      const mockPeerConnection = {
        createDataChannel: mockCreateDataChannel,
        setLocalDescription: vi.fn(),
        setRemoteDescription: vi.fn(),
        addIceCandidate: vi.fn(),
        createOffer: vi.fn(),
        createAnswer: vi.fn(),
        close: vi.fn(),
        addEventListener: vi.fn(),
        onicecandidate: null,
        ondatachannel: null,
        oniceconnectionstatechange: null,
        iceConnectionState: 'new',
        connectionState: 'new',
        localDescription: null,
        remoteDescription: null
      }
      
      // Mock RTCPeerConnection constructor
      global.RTCPeerConnection = vi.fn().mockImplementation(() => mockPeerConnection)
      
      createPeerConnection('test', true)
      
      expect(mockCreateDataChannel).toHaveBeenCalledWith('pokerData')
    })

    it('should not create data channel when initiator is false', () => {
      const mockCreateDataChannel = vi.fn()
      const mockPeerConnection = {
        createDataChannel: mockCreateDataChannel,
        setLocalDescription: vi.fn(),
        setRemoteDescription: vi.fn(),
        addIceCandidate: vi.fn(),
        createOffer: vi.fn(),
        createAnswer: vi.fn(),
        close: vi.fn(),
        addEventListener: vi.fn(),
        onicecandidate: null,
        ondatachannel: null,
        oniceconnectionstatechange: null,
        iceConnectionState: 'new',
        connectionState: 'new',
        localDescription: null,
        remoteDescription: null
      }
      
      global.RTCPeerConnection = vi.fn().mockImplementation(() => mockPeerConnection)
      
      createPeerConnection('test', false)
      
      expect(mockCreateDataChannel).not.toHaveBeenCalled()
    })
  })

  describe('sendData', () => {
    beforeEach(() => {
      // Clear data channels
      Object.keys(state.dataChannels).forEach(key => delete state.dataChannels[key])
    })

    it('should send data to all open data channels', () => {
      const mockSend1 = vi.fn()
      const mockSend2 = vi.fn()
      
      state.dataChannels['peer1'] = {
        send: mockSend1,
        readyState: 'open'
      } as any
      
      state.dataChannels['peer2'] = {
        send: mockSend2,
        readyState: 'open'
      } as any

      const voteData = {
        type: 'vote' as const,
        username: 'testUser',
        hasVoted: true,
        vote: '5' as const
      }

      sendData(voteData)

      expect(mockSend1).toHaveBeenCalledWith(JSON.stringify(voteData))
      expect(mockSend2).toHaveBeenCalledWith(JSON.stringify(voteData))
    })

    it('should skip channels that are not ready', () => {
      const mockSend1 = vi.fn()
      const mockSend2 = vi.fn()
      
      state.dataChannels['peer1'] = {
        send: mockSend1,
        readyState: 'open'
      } as any
      
      state.dataChannels['peer2'] = {
        send: mockSend2,
        readyState: 'connecting'
      } as any

      const voteData = {
        type: 'vote' as const,
        username: 'testUser',
        hasVoted: true,
        vote: '5' as const
      }

      sendData(voteData)

      expect(mockSend1).toHaveBeenCalledWith(JSON.stringify(voteData))
      expect(mockSend2).not.toHaveBeenCalled()
    })
  })

  describe('sendDataToPeer', () => {
    beforeEach(() => {
      // Clear data channels
      Object.keys(state.dataChannels).forEach(key => delete state.dataChannels[key])
    })

    it('should send data to specific peer when channel is open', () => {
      const mockSend = vi.fn()
      
      state.dataChannels['peer1'] = {
        send: mockSend,
        readyState: 'open'
      } as any

      const joinData = {
        type: 'join' as const,
        username: 'testUser'
      }

      sendDataToPeer('peer1', joinData)

      expect(mockSend).toHaveBeenCalledWith(JSON.stringify(joinData))
    })

    it('should not send data when channel is not ready', () => {
      const mockSend = vi.fn()
      
      state.dataChannels['peer1'] = {
        send: mockSend,
        readyState: 'connecting'
      } as any

      const joinData = {
        type: 'join' as const,
        username: 'testUser'
      }

      sendDataToPeer('peer1', joinData)

      expect(mockSend).not.toHaveBeenCalled()
    })

    it('should handle missing peer channel gracefully', () => {
      const joinData = {
        type: 'join' as const,
        username: 'testUser'
      }

      // This should not throw an error
      expect(() => sendDataToPeer('nonexistent', joinData)).not.toThrow()
    })
  })
})