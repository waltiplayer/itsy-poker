import { describe, it, expect } from 'vitest'
import type { 
  Client, 
  CreateRoomRequest, 
  JoinRoomRequest, 
  OfferMessage, 
  AnswerMessage, 
  IceCandidateMessage,
  RoomCreatedResponse,
  RoomJoinedResponse,
  ErrorMessage 
} from '../../server/types'

describe('Server Types', () => {
  describe('Client interface', () => {
    it('should have correct structure', () => {
      const mockWebSocket = {} as any
      const client: Client = {
        ws: mockWebSocket,
        roomId: 'room123'
      }

      expect(client.ws).toBe(mockWebSocket)
      expect(client.roomId).toBe('room123')
    })
  })

  describe('Message types', () => {
    it('should create valid CreateRoomRequest', () => {
      const message: CreateRoomRequest = {
        type: 'create-room',
        username: 'testuser'
      }

      expect(message.type).toBe('create-room')
      expect(message.username).toBe('testuser')
    })

    it('should create valid JoinRoomRequest', () => {
      const message: JoinRoomRequest = {
        type: 'join-room',
        username: 'testuser',
        roomId: 'room123'
      }

      expect(message.type).toBe('join-room')
      expect(message.username).toBe('testuser')
      expect(message.roomId).toBe('room123')
    })

    it('should create valid OfferMessage', () => {
      const mockOffer: RTCSessionDescriptionInit = {
        type: 'offer',
        sdp: 'mock-sdp'
      }

      const message: OfferMessage = {
        type: 'offer',
        username: 'sender',
        from: 'sender',
        peerId: 'peer123',
        offer: mockOffer
      }

      expect(message.type).toBe('offer')
      expect(message.username).toBe('sender')
      expect(message.from).toBe('sender')
      expect(message.peerId).toBe('peer123')
      expect(message.offer).toEqual(mockOffer)
    })

    it('should create valid AnswerMessage', () => {
      const mockAnswer: RTCSessionDescriptionInit = {
        type: 'answer',
        sdp: 'mock-sdp'
      }

      const message: AnswerMessage = {
        type: 'answer',
        username: 'receiver',
        from: 'receiver',
        peerId: 'peer123',
        answer: mockAnswer
      }

      expect(message.type).toBe('answer')
      expect(message.username).toBe('receiver')
      expect(message.from).toBe('receiver')
      expect(message.peerId).toBe('peer123')
      expect(message.answer).toEqual(mockAnswer)
    })

    it('should create valid IceCandidateMessage', () => {
      const mockCandidate: RTCIceCandidateInit = {
        candidate: 'mock-candidate',
        sdpMid: 'data',
        sdpMLineIndex: 0
      }

      const message: IceCandidateMessage = {
        type: 'ice-candidate',
        username: 'sender',
        from: 'sender',
        peerId: 'peer123',
        candidate: mockCandidate
      }

      expect(message.type).toBe('ice-candidate')
      expect(message.username).toBe('sender')
      expect(message.from).toBe('sender')
      expect(message.peerId).toBe('peer123')
      expect(message.candidate).toEqual(mockCandidate)
    })
  })

  describe('Response types', () => {
    it('should create valid RoomCreatedResponse', () => {
      const response: RoomCreatedResponse = {
        type: 'room-created',
        roomId: 'room123'
      }

      expect(response.type).toBe('room-created')
      expect(response.roomId).toBe('room123')
    })

    it('should create valid RoomJoinedResponse', () => {
      const response: RoomJoinedResponse = {
        type: 'room-joined',
        roomId: 'room123',
        participants: ['user1', 'user2']
      }

      expect(response.type).toBe('room-joined')
      expect(response.roomId).toBe('room123')
      expect(response.participants).toEqual(['user1', 'user2'])
    })

    it('should create valid ErrorMessage', () => {
      const error: ErrorMessage = {
        type: 'error',
        message: 'Room not found'
      }

      expect(error.type).toBe('error')
      expect(error.message).toBe('Room not found')
    })
  })
})