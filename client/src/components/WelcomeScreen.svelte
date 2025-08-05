<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { connectToSignallingServer, createRoom, joinRoom } from '../lib/signalling';

  const dispatch = createEventDispatcher();

  let createName = '';
  let joinName = '';
  let roomId = '';
  let isLoading = false;
  let errorMessage = '';

  onMount(() => {
    // Check for predefined room ID in query params
    const urlParams = new URLSearchParams(window.location.search);
    roomId = urlParams.get('roomId') || '';
  });

  async function handleCreateRoom() {
    if (!createName.trim()) {
      errorMessage = 'Please enter your name';
      return;
    }

    isLoading = true;
    errorMessage = '';

    try {
      await connectToSignallingServer();
      const newRoomId = await createRoom(createName.trim());
      dispatch('roomJoined', {
        roomId: newRoomId,
        username: createName.trim(),
        isHost: true
      });
    } catch (error) {
      errorMessage = 'Failed to create room. Please try again.';
      console.error('Error creating room:', error);
    } finally {
      isLoading = false;
    }
  }

  async function handleJoinRoom() {
    if (!joinName.trim() || !roomId.trim()) {
      errorMessage = 'Please enter your name and room ID';
      return;
    }

    isLoading = true;
    errorMessage = '';

    try {
      await connectToSignallingServer();
      await joinRoom(roomId.trim(), joinName.trim());
      dispatch('roomJoined', {
        roomId: roomId.trim(),
        username: joinName.trim(),
        isHost: false
      });
    } catch (error) {
      errorMessage = 'Failed to join room. Please check the room ID and try again.';
      console.error('Error joining room:', error);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="flex flex-col items-center gap-8 py-8">
  <h1 class="text-5xl font-bold text-primary mb-8">ItsyPoker</h1>
  
  {#if errorMessage}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
      {errorMessage}
    </div>
  {/if}

  <div class="flex flex-col md:flex-row gap-8">
    <!-- Create Room Card -->
    <div class="card">
      <h2 class="text-2xl font-semibold text-secondary mb-4">Create a New Room</h2>
      
      <div class="space-y-4">
        <div>
          <label for="create-name" class="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            id="create-name"
            type="text"
            bind:value={createName}
            placeholder="Enter your name"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
        </div>
        
        <button
          on:click={handleCreateRoom}
          disabled={isLoading}
          class="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating...' : 'Create Room'}
        </button>
      </div>
    </div>

    <!-- Join Room Card -->
    <div class="card">
      <h2 class="text-2xl font-semibold text-secondary mb-4">Join a Room</h2>
      
      <div class="space-y-4">
        <div>
          <label for="join-name" class="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            id="join-name"
            type="text"
            bind:value={joinName}
            placeholder="Enter your name"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label for="room-id" class="block text-sm font-medium text-gray-700 mb-1">
            Room ID
          </label>
          <input
            id="room-id"
            type="text"
            bind:value={roomId}
            placeholder="Enter room ID"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
        </div>
        
        <button
          on:click={handleJoinRoom}
          disabled={isLoading}
          class="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Joining...' : 'Join Room'}
        </button>
      </div>
    </div>
  </div>
</div>