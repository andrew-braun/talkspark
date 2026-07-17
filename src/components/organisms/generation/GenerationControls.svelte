<script lang="ts">
	import { generationParams } from 'stores/generation.svelte';
	import SparkSentence from 'components/molecules/generation/SparkSentence.svelte';
	import CustomizeSheet from 'components/organisms/generation/CustomizeSheet.svelte';
	import { activeLeverCount, type LeverKey } from 'lib/data/generation-options';

	let sheetOpen = $state(false);
	let focusField = $state<LeverKey | null>(null);

	// Badge count: one per set lever, 0–6.
	const activeCount = $derived(activeLeverCount(generationParams));

	function openSheet(field: LeverKey | null = null) {
		focusField = field;
		sheetOpen = true;
	}
</script>

<div class="generation-controls">
	<SparkSentence onEditLever={(key) => openSheet(key)} />

	<button
		type="button"
		class="customize"
		class:active={activeCount > 0}
		aria-haspopup="dialog"
		aria-expanded={sheetOpen}
		onclick={() => openSheet(null)}
	>
		<span>Customize</span>
		{#if activeCount > 0}
			<span class="badge" aria-label={`${activeCount} settings changed`}>{activeCount}</span>
		{/if}
	</button>

	<CustomizeSheet open={sheetOpen} onOpenChange={(value) => (sheetOpen = value)} {focusField} />
</div>

<style lang="scss">
	.generation-controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-lg);
		width: 100%;

		.customize {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: var(--spacing-sm);
			min-height: var(--tap-target-lg);
			padding: 0 var(--spacing-lg);
			border: 1px solid var(--tertiary-color);
			border-radius: var(--border-radius-lg);
			background: transparent;
			color: var(--text-color-light);
			font-size: var(--font-size-md);
			font-weight: 600;
			transition: var(--transition-std);

			&:hover {
				cursor: pointer;
				border-color: var(--accent-color-5);
			}

			// When any lever is set, the button carries the brand accent to read as "tuned".
			&.active {
				border-color: transparent;
				background: var(--spark-background-color);
				box-shadow: inset 0 0 0 1px var(--accent-color-5);
			}

			.badge {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				min-width: 22px;
				height: 22px;
				padding: 0 var(--spacing-xs);
				border-radius: var(--border-radius-xl);
				background: var(--gradient-1);
				color: var(--chip-selected-ink);
				font-size: var(--font-size-md-sm);
				font-weight: 700;
				line-height: 1;
			}
		}
	}
</style>
