<script lang="ts">
  import type { GamePhase } from '$lib/game/types';
  import SevenSegment from './SevenSegment.svelte';
  import { gameStore } from '$lib/game/gameStore';

  let { phase, minesRemaining, elapsedSeconds, mouseDown }: {
    phase: GamePhase;
    minesRemaining: number;
    elapsedSeconds: number;
    mouseDown: boolean;
  } = $props();

  const smileyFace = $derived(() => {
    if (mouseDown && phase === 'playing') return '😮';
    if (phase === 'won') return '😎';
    if (phase === 'lost') return '😵';
    return '🙂';
  });

  const displayMines = $derived(Math.max(-99, Math.min(999, minesRemaining)));
</script>

<div class="hud" style="box-shadow: inset -2px -2px 0 #ffffff, inset 2px 2px 0 #808080;">
  <SevenSegment value={displayMines} digits={3} />

  <button
    class="smiley-btn"
    onclick={() => gameStore.newGame()}
    title="New Game"
  >
    <span style="font-size: 1.35rem; line-height: 1;">{smileyFace()}</span>
  </button>

  <SevenSegment value={elapsedSeconds} digits={3} />
</div>

<style>
  .hud {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #c0c0c0;
    padding: 4px 6px;
    margin-bottom: 6px;
  }

  .smiley-btn {
    width: 2.25rem;
    height: 2.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #c0c0c0;
    border: none;
    cursor: pointer;
    box-shadow: inset -2px -2px 0 #808080, inset 2px 2px 0 #ffffff;
    padding: 0;
  }

  .smiley-btn:active {
    box-shadow: inset 2px 2px 0 #808080, inset -2px -2px 0 #ffffff;
  }
</style>
