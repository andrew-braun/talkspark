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
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;

		// Fills its grid cell on mobile and shrinks to content once there's a desktop row.
		width: 100%;
		min-height: var(--tap-target-min);
		gap: var(--spacing-xs);
		padding: var(--spacing-sm) var(--spacing-md);
		border: 1px solid var(--tertiary-color);
		border-radius: var(--border-radius-lg);
		background: transparent;
		color: var(--text-color-light);
		text-align: left;
		transition: var(--transition-std);

		@media (width >= 768px) {
			width: auto;
		}

		&:hover,
		&.open {
			cursor: pointer;
			border-color: var(--accent-color-5);
		}

		.lever-label {
			color: var(--tertiary-color);
			font-size: var(--font-size-xs);
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.05em;
		}

		.lever-value {
			font-size: var(--font-size-sm);
			font-weight: 500;
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
