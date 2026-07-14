<script lang="ts" generics="T extends string">
	import Popover from 'components/atoms/overlays/Popover.svelte';
	import Chip from 'components/atoms/buttons/Chip.svelte';
	import type { LeverOption } from 'lib/data/generation-options';

	let {
		label,
		options,
		value,
		onSelect,
	}: {
		label: string;
		options: LeverOption<T>[];
		value: T | undefined;
		onSelect: (value: T) => void;
	} = $props();

	const currentLabel = $derived(options.find((o) => o.value === value)?.label ?? label);
</script>

<Popover placement="bottom-start">
	{#snippet trigger({ triggerProps, open })}
		<button {...triggerProps} class="lever-pill" class:open>
			<span class="lever-label">{label}</span>
			<span class="lever-value">{currentLabel}</span>
		</button>
	{/snippet}

	{#snippet content({ close })}
		<div class="chip-row">
			{#each options as option (option.value)}
				<Chip
					label={option.label}
					selected={value === option.value}
					onClick={() => {
						onSelect(option.value);
						close();
					}}
				/>
			{/each}
		</div>
	{/snippet}
</Popover>

<style lang="scss">
	.lever-pill {
		display: flex;

		// Mobile: one full-width lever per row, label left and value right, like a settings
		// list. Two columns can't hold 16px text — the label alone needs more than a half-width
		// cell — and 16px is the floor for control text, so the layout gives way, not the type.
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-md);
		width: 100%;
		min-height: var(--tap-target-lg);
		padding: var(--spacing-sm) var(--spacing-md);
		border: 1px solid var(--tertiary-color);
		border-radius: var(--border-radius-lg);
		background: transparent;
		color: var(--text-color-light);
		text-align: left;
		transition: var(--transition-std);

		// Desktop: the compact two-line pill, sized to its content in a wrapping row.
		@media (width >= 768px) {
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			gap: var(--spacing-xs);
			width: auto;
			min-height: var(--tap-target-min);
		}

		&:hover,
		&.open {
			cursor: pointer;
			border-color: var(--accent-color-5);
		}

		// The label was an all-caps 10px eyebrow. At a legible 16px, caps plus wide tracking
		// just costs ~25% more width and reads as shouting, so hierarchy comes from colour
		// and weight instead.
		.lever-label {
			flex: 0 0 auto;
			color: var(--tertiary-color);
			font-size: var(--font-size-md);
			font-weight: 600;
			letter-spacing: 0.02em;
		}

		.lever-value {
			font-size: var(--font-size-md);
			font-weight: 500;
			text-align: right;

			@media (width >= 768px) {
				text-align: left;
			}
		}
	}

	// Width is clamped by the popover surface itself now, so this no longer pins a
	// desktop-sized 280px on a phone.
	.chip-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--tap-gap-min);
	}
</style>
