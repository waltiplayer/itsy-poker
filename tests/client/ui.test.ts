import { describe, it, expect, beforeEach, vi } from 'vitest'
import { showScreen, updateParticipantsList, updateVoteStatus } from '../../client/scripts/ui'
import { state } from '../../client/scripts/app'

describe('UI', () => {
  beforeEach(() => {
    // Clear the DOM
    document.body.innerHTML = `
      <div id="welcome-screen" class="screen">Welcome</div>
      <div id="room-screen" class="screen hidden">Room</div>
      <ul id="participants-list"></ul>
      <div id="vote-status">Vote Status</div>
      <div id="results-panel" class="hidden">Results</div>
    `
    
    // Reset state
    state.roomId = null
    state.isHost = false
    state.username = ''
    state.participants = {}
    state.currentVote = null
    state.revealedVotes = false
    state.dataChannels = {}
    
    vi.clearAllMocks()
  })

  describe('showScreen', () => {
    it('should show the specified screen and hide others', () => {
      const welcomeScreen = document.getElementById('welcome-screen')!
      const roomScreen = document.getElementById('room-screen')!
      
      // Initially welcome screen should be visible
      expect(welcomeScreen.classList.contains('hidden')).toBe(false)
      expect(roomScreen.classList.contains('hidden')).toBe(true)
      
      // Show room screen
      showScreen('room-screen')
      
      expect(welcomeScreen.classList.contains('hidden')).toBe(true)
      expect(roomScreen.classList.contains('hidden')).toBe(false)
    })

    it('should show welcome screen when requested', () => {
      // First show room screen
      showScreen('room-screen')
      
      const welcomeScreen = document.getElementById('welcome-screen')!
      const roomScreen = document.getElementById('room-screen')!
      
      expect(welcomeScreen.classList.contains('hidden')).toBe(true)
      expect(roomScreen.classList.contains('hidden')).toBe(false)
      
      // Now show welcome screen
      showScreen('welcome-screen')
      
      expect(welcomeScreen.classList.contains('hidden')).toBe(false)
      expect(roomScreen.classList.contains('hidden')).toBe(true)
    })
  })

  describe('updateParticipantsList', () => {
    it('should display participants correctly', () => {
      state.participants = {
        'alice': { username: 'alice', isHost: true, hasVoted: false, vote: null },
        'bob': { username: 'bob', isHost: false, hasVoted: true, vote: '5' }
      }
      
      updateParticipantsList()
      
      const participantsList = document.getElementById('participants-list')!
      const listItems = participantsList.querySelectorAll('li')
      
      expect(listItems).toHaveLength(2)
      
      // Check that alice is marked as host
      const aliceItem = Array.from(listItems).find(item => 
        item.textContent?.includes('alice (Host)')
      )
      expect(aliceItem).toBeTruthy()
      
      // Check that bob is present
      const bobItem = Array.from(listItems).find(item => 
        item.textContent?.includes('bob') && !item.textContent?.includes('Host')
      )
      expect(bobItem).toBeTruthy()
    })

    it('should show vote values when votes are revealed', () => {
      state.participants = {
        'alice': { username: 'alice', isHost: true, hasVoted: true, vote: '8' },
        'bob': { username: 'bob', isHost: false, hasVoted: false, vote: null }
      }
      state.revealedVotes = true
      
      updateParticipantsList()
      
      const participantsList = document.getElementById('participants-list')!
      
      expect(participantsList.textContent).toContain('8')
      expect(participantsList.textContent).toContain('No vote')
    })

    it('should show vote status when votes are not revealed', () => {
      state.participants = {
        'alice': { username: 'alice', isHost: true, hasVoted: true, vote: '8' },
        'bob': { username: 'bob', isHost: false, hasVoted: false, vote: null }
      }
      state.revealedVotes = false
      
      updateParticipantsList()
      
      const participantsList = document.getElementById('participants-list')!
      
      expect(participantsList.textContent).toContain('Voted')
      expect(participantsList.textContent).toContain('Not voted')
      expect(participantsList.textContent).not.toContain('8')
    })

    it('should clear list when no participants', () => {
      state.participants = {}
      
      updateParticipantsList()
      
      const participantsList = document.getElementById('participants-list')!
      expect(participantsList.children).toHaveLength(0)
    })
  })

  describe('updateVoteStatus', () => {
    beforeEach(() => {
      // Add required DOM elements for vote status
      document.body.innerHTML += `
        <div id="reveal-btn">Reveal</div>
        <div id="new-round-btn">New Round</div>
      `
    })

    it('should show reveal button when user is host', () => {
      state.participants = {
        'alice': { username: 'alice', isHost: true, hasVoted: true, vote: '5' },
        'bob': { username: 'bob', isHost: false, hasVoted: true, vote: '8' }
      }
      state.isHost = true
      state.revealedVotes = false
      
      updateVoteStatus()
      
      const revealBtn = document.getElementById('reveal-btn') as HTMLElement
      expect(revealBtn?.style.display).toBe('block')
    })

    it('should show reveal button when user is host even if not all voted', () => {
      state.participants = {
        'alice': { username: 'alice', isHost: true, hasVoted: true, vote: '5' },
        'bob': { username: 'bob', isHost: false, hasVoted: false, vote: null }
      }
      state.isHost = true
      state.revealedVotes = false
      
      updateVoteStatus()
      
      const revealBtn = document.getElementById('reveal-btn') as HTMLElement
      expect(revealBtn?.style.display).toBe('block')
    })

    it('should hide reveal button when user is not host', () => {
      state.participants = {
        'alice': { username: 'alice', isHost: true, hasVoted: true, vote: '5' },
        'bob': { username: 'bob', isHost: false, hasVoted: true, vote: '8' }
      }
      state.isHost = false
      state.revealedVotes = false
      
      updateVoteStatus()
      
      const revealBtn = document.getElementById('reveal-btn') as HTMLElement
      expect(revealBtn?.style.display).toBe('none')
    })
  })
})