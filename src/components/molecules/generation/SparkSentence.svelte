<script lang="ts">
	import { generationParams } from 'stores/generation.svelte';
	import { buildSparkSentence } from 'lib/data/spark-sentence';
	import type { LeverKey } from 'lib/data/generation-options';

	// The front-facing summary of the picker, written as one plain-English sentence. Each
	// coloured word is a tappable slot that opens the Customize sheet focused on its lever.
	let { onEditLever }: { onEditLever: (key: LeverKey) => void } = $props();

	const segments = $derived(buildSparkSentence(generationParams));
</script>

<p class="spark-sentence">
	{#each segments as segment, i (i)}
		{#if segment.kind === 'slot'}
			<button
				type="button"
				class="slot"
				style={`--fc: var(${segment.colorVar})`}
				onclick={() => onEditLever(segment.key)}
			>
				{segment.text}
			</button>
		{:else}
			{segment.text}
		{/if}
	{/each}
</p>

<style lang="scss">
	.spark-sentence {
		margin: 0;
		max-width: 34ch;
		color: var(--text-color-light);
		font-size: var(--font-size-lg);

		// Generous leading so the 44px inline slot targets don't crowd across wrapped lines.
		line-height: 2.1;
		text-align: center;
		text-wrap: balance;

		.slot {
			display: inline-flex;
			align-items: center;
			min-height: var(--tap-target-min);
			padding: 2px var(--spacing-xs);
			border: 0;
			border-radius: var(--border-radius-md);
			background: transparent;
			color: var(--fc);
			font-size: inherit;
			font-weight: 700;
			line-height: 1.15;
			text-decoration: underline;
			text-decoration-thickness: 2px;
			text-underline-offset: 3px;
			transition: var(--transition-std);

			&:hover {
				cursor: pointer;
				background: var(--fc);
				color: var(--chip-selected-ink);
				text-decoration: none;
			}
		}
	}
</style>
