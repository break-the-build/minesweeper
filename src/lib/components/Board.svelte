<script lang="ts">
  import type { Board, GamePhase } from '$lib/game/types';
  import Cell from './Cell.svelte';

  let { board, phase, onMouseDown, onMouseUp }: {
    board: Board;
    phase: GamePhase;
    onMouseDown?: () => void;
    onMouseUp?: () => void;
  } = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="board-container"
  onmousedown={onMouseDown}
  onmouseup={onMouseUp}
  onmouseleave={onMouseUp}
  style="box-shadow: inset -2px -2px 0 #ffffff, inset 2px 2px 0 #808080;"
>
  <div
    class="board-grid"
    style="grid-template-columns: repeat({board.cols}, 1.75rem);"
  >
    {#each board.cells as row}
      {#each row as cell}
        <Cell {cell} {phase} />
      {/each}
    {/each}
  </div>
</div>

<style>
  .board-container {
    display: inline-block;
    padding: 3px;
    background-color: #c0c0c0;
  }

  .board-grid {
    display: grid;
  }
</style>
