<script lang="ts">
  let { value, digits = 3 }: { value: number; digits?: number } = $props();

  let display = $derived(
    Math.max(0, Math.min(value, Math.pow(10, digits) - 1))
      .toString()
      .padStart(digits, '0')
  );
</script>

<div
  class="inline-flex items-center bg-black px-1 py-0.5 font-mono font-bold tabular-nums leading-none"
  style="font-size: 1.5rem; color: #ff0000; letter-spacing: 0.05em; min-width: {digits * 1.1}ch; text-shadow: 0 0 4px #ff000066;"
>
  {display}
</div>
