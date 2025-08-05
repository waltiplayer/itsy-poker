<script lang="ts">
  import { sendData } from '../lib/webrtc-simple';
  import { appState } from '../lib/stores';
  import type { PokerCard } from '../lib/types';

  const pokerCards: PokerCard[] = ['1', '2', '3', '5', '8', '13', '?'];

  function handleCardSelection(card: PokerCard) {
    console.log('AppState before card selection:', $appState);
    appState.update(state => ({
      ...state,
      currentVote: card,
      participants: {
        ...state.participants,
        [$appState.username]: {
          ...state.participants[$appState.username],
          vote: card,
          hasVoted: true
        }
      }
    }));
    console.log('AppState before card selection:', $appState);
    // Send vote to other participants
    sendData({
      type: 'vote',
      vote: card,
      username: $appState.username,
      hasVoted: true
    });
  }

  function handleRevealVotes() {
    appState.update(state => ({
      ...state,
      revealedVotes: true
    }));
    sendData({
      type: 'reveal'
    });
  }

  function handleNewRound() {
    appState.update(state => {
      const updatedParticipants = { ...state.participants };
      Object.keys(updatedParticipants).forEach(username => {
        updatedParticipants[username].vote = null;
        updatedParticipants[username].hasVoted = false;
      });
      
      return {
        ...state,
        currentVote: null,
        revealedVotes: false,
        participants: updatedParticipants
      };
    });
    
    sendData({
      type: 'newRound'
    });
  }

  async function handleCopyLink() {
    const roomUrl = `${window.location.origin}?roomId=${$appState.roomId}`;
    try {
      await navigator.clipboard.writeText(roomUrl);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  }

  $: participantsList = Object.entries($appState.participants);
  $: allVoted = participantsList.length > 0 && participantsList.every(([_, participant]) => participant.vote !== null);
</script>

<div class="space-y-6">
  <!-- Header -->
  <header class="flex justify-between items-center pb-4 border-b border-gray-200">
    <h1 class="text-4xl font-bold text-primary">ItsyPoker</h1>
    
    <div class="flex items-center gap-4">
      <span class="text-gray-600">
        Room: <span class="font-semibold text-secondary">{$appState.roomId}</span>
      </span>
      <button
        on:click={handleCopyLink}
        class="btn btn-small btn-secondary"
      >
        Copy Link
      </button>
    </div>
  </header>

  <!-- Main Content -->
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Participants Panel -->
    <div class="lg:col-span-1">
      <div class="bg-white rounded-lg shadow-md p-5">
        <h2 class="text-xl font-semibold text-secondary mb-4">Participants</h2>
        
        <ul class="space-y-2">
          {#each participantsList as [username, participant]}
            <li class="flex justify-between items-center py-2 px-3 border-b border-gray-100 last:border-b-0">
              <span class="font-medium">{username}</span>
              <span class="text-sm">
                {#if $appState.revealedVotes && participant.vote}
                  <span class="bg-primary text-white px-2 py-1 rounded text-xs">
                    {participant.vote}
                  </span>
                {:else if participant.vote}
                  <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    Voted
                  </span>
                {:else}
                  <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    Waiting
                  </span>
                {/if}
              </span>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <!-- Voting Panel -->
    <div class="lg:col-span-3">
      <div class="bg-white rounded-lg shadow-md p-5 mb-6">
        <h2 class="text-xl font-semibold text-secondary mb-4">Select Your Card</h2>
        
        <div class="flex flex-wrap justify-center gap-4">
          {#each pokerCards as card}
            <button
              on:click={() => handleCardSelection(card)}
              class="poker-card flex items-center justify-center {$appState.currentVote === card ? 'selected' : ''}"
              disabled={$appState.revealedVotes}
            >
              {card}
            </button>
          {/each}
        </div>
      </div>

      <!-- Controls Panel -->
      <div class="bg-white rounded-lg shadow-md p-5 mb-6">
        <div class="flex justify-center gap-4 items-center">
          {#if $appState.isHost}
          <button
            on:click={handleRevealVotes}
            disabled={!allVoted || $appState.revealedVotes}
            class="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reveal Votes
          </button>
          
          <button
            on:click={handleNewRound}
            class="btn btn-secondary"
          >
            New Round
          </button>
          {/if}
          
          <p class="text-gray-600">
            Status: 
            <span class="font-semibold">
              {#if $appState.revealedVotes}
                Votes revealed
              {:else if allVoted}
                All voted - ready to reveal
              {:else}
                Waiting for votes...
              {/if}
            </span>
          </p>
        </div>
      </div>

      <!-- Results Panel -->
      {#if $appState.revealedVotes}
        <div class="bg-white rounded-lg shadow-md p-5">
          <h2 class="text-xl font-semibold text-secondary mb-4">Results</h2>
          
          <div class="flex flex-wrap justify-center gap-4">
            {#each participantsList as [username, participant]}
              {#if participant.vote}
                <div class="text-center">
                  <div class="poker-card flex items-center justify-center mb-2 bg-primary text-white">
                    {participant.vote}
                  </div>
                  <p class="text-sm text-gray-600">{username}</p>
                </div>
              {/if}
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>