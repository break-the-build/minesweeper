<script lang="ts">
  import type { Difficulty } from '$lib/game/types';
  import { DIFFICULTY_CONFIGS } from '$lib/game/constants';
  import { gameStore } from '$lib/game/gameStore';

  let { current }: { current: Difficulty } = $props();

  const difficulties: Difficulty[] = ['beginner', 'intermediate', 'expert'];

  const labels: Record<Difficulty, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    expert: 'Expert',
  };
</script>

<div class="picker">
  {#each difficulties as diff}
    {@const config = DIFFICULTY_CONFIGS[diff]}
    <button
      class="diff-btn"
      class:active={current === diff}
      onclick={() => gameStore.newGame(diff)}
    >
      <span class="label">{labels[diff]}</span>
      <span class="meta">{config.cols}×{config.rows} · {config.mines} mines</span>
    </button>
  {/each}
</div>

<style>
  .picker {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
  }

  .diff-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4px 10px;
    background-color: #c0c0c0;
    border: none;
    cursor: pointer;
    font-family: Arial, sans-serif;
    box-shadow: inset -2px -2px 0 #808080, inset 2px 2px 0 #ffffff;
    min-width: 90px;
  }

  .diff-btn:active,
  .diff-btn.active {
    box-shadow: inset 2px 2px 0 #808080, inset -2px -2px 0 #ffffff;
  }

  .label {
    font-size: 0.8rem;
    font-weight: bold;
  }

  .meta {
    font-size: 0.65rem;
    color: #444;
  }
</style>
