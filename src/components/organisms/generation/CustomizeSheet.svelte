<script lang="ts">
	import Sheet from 'components/atoms/overlays/Sheet.svelte';
	import LeverField from 'components/molecules/generation/LeverField.svelte';
	import { generationParams } from 'stores/generation.svelte';
	import { LEVER_FIELDS, activeLeverCount, type LeverKey } from 'lib/data/generation-options';
	import { DEFAULT_LEVER_VALUE } from 'ts/params';

	let {
		open,
		onOpenChange,
		focusField = null,
	}: {
		open: boolean;
		onOpenChange: (open: boolean) => void;
		focusField?: LeverKey | null;
	} = $props();

	const activeCount = $derived(activeLeverCount(generationParams));

	// When the sheet is opened from a sentence word, land focus on that lever's first chip.
	const initialFocusEl = () =>
		focusField
			? document.querySelector<HTMLElement>(`#lever-field-${focusField} button`)
			: null;

	function resetAll() {
		for (const field of LEVER_FIELDS) field.set(generationParams, DEFAULT_LEVER_VALUE);
	}
</script>

<Sheet {open} {onOpenChange} {initialFocusEl} title="Customize your spark">
	{#snippet headerActions()}
		<button type="button" class="reset" onclick={resetAll} disabled={activeCount === 0}>
			Reset all
		</button>
	{/snippet}

	{#snippet content()}
		{#each LEVER_FIELDS as field (field.key)}
			<LeverField
				{field}
				value={field.get(generationParams)}
				onSelect={(value) => field.set(generationParams, value)}
			/>
		{/each}
	{/snippet}

	{#snippet footer({ close })}
		<button type="button" class="done" onclick={close}>Done</button>
	{/snippet}
</Sheet>

<style lang="scss">
	.reset {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap-target-min);
		padding: 0 var(--spacing-md);
		border: 0;
		border-radius: var(--border-radius-lg);
		background: transparent;
		color: var(--accent-color-5);
		font-size: var(--font-size-md);
		font-weight: 600;
		transition: var(--transition-std);

		&:hover:not(:disabled) {
			cursor: pointer;
			text-decoration: underline;
		}

		&:disabled {
			color: var(--tertiary-color);
			opacity: 0.6;
		}
	}

	.done {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: var(--tap-target-lg);
		padding: 0 var(--spacing-xl);
		border: 0;
		border-radius: var(--border-radius-lg);
		background: var(--gradient-1);
		color: var(--chip-selected-ink);
		font-size: var(--font-size-md);
		font-weight: 700;
		transition: var(--transition-std);

		&:hover {
			cursor: pointer;
			opacity: 0.92;
		}
	}
</style>
