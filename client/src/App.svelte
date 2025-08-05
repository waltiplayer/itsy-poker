<script lang="ts">
  import { onMount } from 'svelte';
  import WelcomeScreen from './components/WelcomeScreen.svelte';
  import RoomScreen from './components/RoomScreen.svelte';
  import { initWebRTC } from './lib/webrtc-simple';
  import { appState } from './lib/stores';

  let currentScreen: 'welcome' | 'room' = 'welcome';

  onMount(() => {
    // Initialize WebRTC
    initWebRTC();
  });

  function handleRoomJoined(roomId: string, username: string, isHost: boolean) {
    appState.update(state => ({
      ...state,
      roomId,
      username,
      isHost,
      participants: {
        ...state.participants,
        [username]: {
          username,
          isHost,
          hasVoted: false,
          vote: null
        }
      }
    }));
    currentScreen = 'room';
  }
</script>

<main class="min-h-screen bg-gray-50 p-5">
  <div class="max-w-6xl mx-auto">
    {#if currentScreen === 'welcome'}
      <WelcomeScreen on:roomJoined={(e) => handleRoomJoined(e.detail.roomId, e.detail.username, e.detail.isHost)} />
    {:else}
      <RoomScreen />
    {/if}
  </div>
</main>