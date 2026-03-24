<script lang="ts">
  import type { Cell, GamePhase } from '$lib/game/types';
  import { NUMBER_COLORS } from '$lib/game/constants';
  import { gameStore } from '$lib/game/gameStore';

  let { cell, phase }: { cell: Cell; phase: GamePhase } = $props();

  const disabled = $derived(phase === 'won' || phase === 'lost');

  function handleClick(e: MouseEvent) {
    if (disabled) return;
    if (e.button === 1) {
      e.preventDefault();
      gameStore.chordReveal(cell.row, cell.col);
    } else {
      gameStore.reveal(cell.row, cell.col);
    }
  }

  function handleRightClick(e: MouseEvent) {
    e.preventDefault();
    if (disabled) return;
    gameStore.flag(cell.row, cell.col);
  }

  function handleAuxClick(e: MouseEvent) {
    if (e.button === 1) {
      e.preventDefault();
      if (disabled) return;
      gameStore.chordReveal(cell.row, cell.col);
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="cell"
  class:hidden-cell={cell.state === 'hidden' || cell.state === 'flagged' || cell.state === 'question'}
  class:revealed-cell={cell.state === 'revealed'}
  class:mine-cell={cell.state === 'revealed' && cell.isMine}
  onclick={handleClick}
  oncontextmenu={handleRightClick}
  onauxclick={handleAuxClick}
>
  {#if cell.state === 'flagged'}
    <span class="text-base leading-none">🚩</span>
  {:else if cell.state === 'question'}
    <span class="font-bold text-black" style="font-size: 0.85rem;">?</span>
  {:else if cell.state === 'revealed'}
    {#if cell.isMine}
      <span class="text-base leading-none">💣</span>
    {:else if cell.adjacentMines > 0}
      <span
        class="font-bold leading-none"
        style="font-size: 0.85rem; color: {NUMBER_COLORS[cell.adjacentMines]};"
      >
        {cell.adjacentMines}
      </span>
    {/if}
  {/if}
</div>

<style>
  .cell {
    width: 1.75rem;
    height: 1.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
    flex-shrink: 0;
  }

  .hidden-cell {
    background-color: #c0c0c0;
    box-shadow: inset -2px -2px 0 #808080, inset 2px 2px 0 #ffffff;
  }

  .hidden-cell:active:not(.mine-cell) {
    box-shadow: inset 1px 1px 0 #808080;
  }

  .revealed-cell {
    background-color: #c0c0c0;
    box-shadow: inset 1px 1px 0 #808080;
  }

  .mine-cell {
    background-color: #ff0000;
  }
</style>
