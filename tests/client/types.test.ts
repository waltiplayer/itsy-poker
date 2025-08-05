import { describe, it, expect } from 'vitest'
import type { AppState, Participant, PokerCard, DataMessage, SignallingMessage } from '../../client/scripts/types'

describe('Types', () => {
  describe('PokerCard', () => {
    it('should accept valid poker card values', () => {
      const validCards: PokerCard[] = ['1', '2', '3', '5', '8', '13', '?']
      
      validCards.forEach(card => {
        expect(['1', '2', '3', '5', '8', '13', '?']).toContain(card)
      })
    })
  })

  describe('AppState', () => {
    it('should have correct initial structure', () => {
      const state: AppState = {
        roomId: null,
        isHost: false,
        username: '',
        participants: {},
        currentVote: null,
        revealedVotes: false,
        dataChannels: {}
      }

      expect(state.roomId).toBe(null)
      expect(state.isHost).toBe(false)
      expect(state.username).toBe('')
      expect(state.participants).toEqual({})
      expect(state.currentVote).toBe(null)
      expect(state.revealedVotes).toBe(false)
      expect(state.dataChannels).toEqual({})
    })
  })

  describe('Participant', () => {
    it('should have correct structure', () => {
      const participant: Participant = {
        username: 'testuser',
        isHost: false,
        hasVoted: false,
        vote: null
      }

      expect(participant.username).toBe('testuser')
      expect(participant.isHost).toBe(false)
      expect(participant.hasVoted).toBe(false)
      expect(participant.vote).toBe(null)
    })

    it('should allow valid vote values', () => {
      const participant: Participant = {
        username: 'testuser',
        isHost: false,
        hasVoted: true,
        vote: '5'
      }

      expect(participant.vote).toBe('5')
    })
  })

  describe('DataMessage types', () => {
    it('should create valid JoinMessage', () => {
      const joinMessage: DataMessage = {
        type: 'join',
        username: 'testuser'
      }

      expect(joinMessage.type).toBe('join')
      expect(joinMessage.username).toBe('testuser')
    })

    it('should create valid VoteMessage', () => {
      const voteMessage: DataMessage = {
        type: 'vote',
        username: 'testuser',
        hasVoted: true,
        vote: '8'
      }

      expect(voteMessage.type).toBe('vote')
      expect(voteMessage.username).toBe('testuser')
      expect(voteMessage.hasVoted).toBe(true)
      expect(voteMessage.vote).toBe('8')
    })

    it('should create valid RevealMessage', () => {
      const revealMessage: DataMessage = {
        type: 'reveal'
      }

      expect(revealMessage.type).toBe('reveal')
    })

    it('should create valid NewRoundMessage', () => {
      const newRoundMessage: DataMessage = {
        type: 'newRound'
      }

      expect(newRoundMessage.type).toBe('newRound')
    })

    it('should create valid StateMessage', () => {
      const stateMessage: DataMessage = {
        type: 'state',
        participants: {
          'user1': { username: 'user1', isHost: true, hasVoted: false, vote: null }
        },
        revealedVotes: false
      }

      expect(stateMessage.type).toBe('state')
      expect(stateMessage.participants).toBeDefined()
      expect(stateMessage.revealedVotes).toBe(false)
    })
  })

  describe('SignallingMessage types', () => {
    it('should create valid CreateRoomMessage', () => {
      const createMessage: SignallingMessage = {
        type: 'create-room',
        username: 'host'
      }

      expect(createMessage.type).toBe('create-room')
      expect(createMessage.username).toBe('host')
    })

    it('should create valid JoinRoomMessage', () => {
      const joinMessage: SignallingMessage = {
        type: 'join-room',
        roomId: 'room123',
        username: 'user1'
      }

      expect(joinMessage.type).toBe('join-room')
      expect(joinMessage.roomId).toBe('room123')
      expect(joinMessage.username).toBe('user1')
    })

    it('should create valid ErrorMessage', () => {
      const errorMessage: SignallingMessage = {
        type: 'error',
        message: 'Room not found'
      }

      expect(errorMessage.type).toBe('error')
      expect(errorMessage.message).toBe('Room not found')
    })
  })
})