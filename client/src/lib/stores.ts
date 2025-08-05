/**
 * Svelte stores for global application state management
 */
import { writable } from 'svelte/store';
import type { AppState, DataMessage } from './types';

/**
 * Global application state store
 */
export const appState = writable<AppState>({
  roomId: null,
  isHost: false,
  username: '',
  participants: {},
  currentVote: null,
  revealedVotes: false,
  dataChannels: {}
});

/**
 * Handle incoming peer data and update state accordingly
 */
export function handlePeerData(message: DataMessage, fromUsername: string): void {
  appState.update(state => {
    switch (message.type) {
      case 'vote':
        if (state.participants[fromUsername]) {
          state.participants[fromUsername].vote = message.vote;
          state.participants[fromUsername].hasVoted = true;
        }
        break;
      
      case 'reveal':
        state.revealedVotes = true;
        break;
      
      case 'newRound':
        state.currentVote = null;
        state.revealedVotes = false;
        // Clear all participant votes
        Object.keys(state.participants).forEach(username => {
          if (state.participants[username]) {
            state.participants[username].vote = null;
            state.participants[username].hasVoted = false;
          }
        });
        break;
      
      case 'participantJoined':
        console.log('Participant joined:', message.username);
        if (message.username && !state.participants[message.username]) {
          state.participants[message.username] = {
            username: message.username,
            isHost: false,
            hasVoted: false,
            vote: null
          };
        }
        break;
      
      case 'participantLeft':
        if (message.username && state.participants[message.username]) {
          delete state.participants[message.username];
        }
        break;
      
      case 'state':
        // Sync state with a peer (usually when they join)
        if (message.participants) {
          // Merge participants, keeping existing ones and adding new ones
          Object.keys(message.participants).forEach(username => {
            if (!state.participants[username]) {
              state.participants[username] = message.participants[username];
            }
          });
        }
        // Update revealed votes state
        state.revealedVotes = message.revealedVotes;
        break;
    }
    
    return state;
  });
}
