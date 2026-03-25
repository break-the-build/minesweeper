<script lang="ts">
  import { gameStore } from '$lib/game/gameStore';
  import Board from '$lib/components/Board.svelte';
  import HUD from '$lib/components/HUD.svelte';
  import DifficultyPicker from '$lib/components/DifficultyPicker.svelte';
  import Confetti from '$lib/components/Confetti.svelte';

  let mouseDown = $state(false);

  const state = $derived($gameStore);
</script>

<svelte:window oncontextmenu={(e) => e.preventDefault()} />

<main class="flex min-h-screen flex-col items-center justify-center p-4">
  <div class="window">
    <!-- Title bar -->
    <div class="title-bar">
      <span>💣 Minesweeper</span>
    </div>

    <!-- Game area -->
    <div class="game-area">
      <DifficultyPicker current={state.difficulty} />

      <HUD
        phase={state.phase}
        minesRemaining={state.minesRemaining}
        elapsedSeconds={state.elapsedSeconds}
        {mouseDown}
      />

      <div class="overflow-x-auto">
        <Board
          board={state.board}
          phase={state.phase}
          onMouseDown={() => { if (state.phase === 'playing') mouseDown = true; }}
          onMouseUp={() => { mouseDown = false; }}
        />
      </div>

      {#if state.phase === 'won'}
        <Confetti />
        <p class="status-msg win">You win! 🎉</p>
      {:else if state.phase === 'lost'}
        <p class="status-msg lose">Game over! 💀</p>
      {/if}
    </div>
  </div>
</main>

<style>
  .window {
    background-color: #c0c0c0;
    box-shadow: inset -2px -2px 0 #808080, inset 2px 2px 0 #ffffff, 4px 4px 0 #000000;
    min-width: fit-content;
  }

  .title-bar {
    background-color: #000080;
    color: #ffffff;
    font-weight: bold;
    font-size: 0.85rem;
    padding: 3px 6px;
    font-family: Arial, sans-serif;
  }

  .game-area {
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .status-msg {
    margin-top: 8px;
    font-weight: bold;
    font-size: 0.85rem;
    font-family: Arial, sans-serif;
  }

  .win { color: #007b00; }
  .lose { color: #ff0000; }
</style>
