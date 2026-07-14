<script lang="ts">
	import Popover from 'components/atoms/overlays/Popover.svelte';
	import Chip from 'components/atoms/buttons/Chip.svelte';
	import {
		DEPTH_LEVEL_MIN,
		DEPTH_LEVEL_MAX,
		CONTROVERSY_LEVEL_MIN,
		CONTROVERSY_LEVEL_MAX,
	} from 'lib/data/generation-options';
	import { DEFAULT_LEVER_VALUE, type DepthAndSafety } from 'ts/params';

	let {
		value,
		onSelect,
	}: {
		value: DepthAndSafety;
		onSelect: (value: DepthAndSafety) => void;
	} = $props();

	const depthSteps = Array.from(
		{ length: DEPTH_LEVEL_MAX - DEPTH_LEVEL_MIN + 1 },
		(_, i) => DEPTH_LEVEL_MIN + i
	);
	const controversySteps = Array.from(
		{ length: CONTROVERSY_LEVEL_MAX - CONTROVERSY_LEVEL_MIN + 1 },
		(_, i) => CONTROVERSY_LEVEL_MIN + i
	);
	const displaySelection = (selection: number | typeof DEFAULT_LEVER_VALUE) =>
		selection === DEFAULT_LEVER_VALUE ? 'Default' : selection;
</script>

<!-- Marquee control: depth & safety is the clearest differentiator (generation-engine.md),
     so its pill stays visually distinct even collapsed. -->
<Popover placement="bottom-start">
	{#snippet trigger({ triggerProps, open })}
		<button {...triggerProps} class="lever-pill marquee" class:open>
			<span class="lever-label">Depth &amp; safety</span>
			<span class="lever-value"
				>Depth {displaySelection(value.depth_level)} · Controversy {displaySelection(
					value.controversy_level
				)}</span
			>
		</button>
	{/snippet}

	{#snippet content()}
		<!-- Two sub-choices live under one lever, so the popover stays open across both
		     selections — closes on outside click / Escape / re-tap. -->
		<div class="sub-lever">
			<span class="sub-label">Depth</span>
			<div class="chip-row">
				<Chip
					label="Default"
					selected={value.depth_level === DEFAULT_LEVER_VALUE}
					onClick={() => onSelect({ ...value, depth_level: DEFAULT_LEVER_VALUE })}
				/>
				{#each depthSteps as step (step)}
					<Chip
						label={String(step)}
						selected={value.depth_level === step}
						onClick={() => onSelect({ ...value, depth_level: step })}
					/>
				{/each}
			</div>
		</div>

		<div class="sub-lever">
			<span class="sub-label">Controversy</span>
			<div class="chip-row">
				<Chip
					label="Default"
					selected={value.controversy_level === DEFAULT_LEVER_VALUE}
					onClick={() => onSelect({ ...value, controversy_level: DEFAULT_LEVER_VALUE })}
				/>
				{#each controversySteps as step (step)}
					<Chip
						label={String(step)}
						selected={value.controversy_level === step}
						onClick={() => onSelect({ ...value, controversy_level: step })}
					/>
				{/each}
			</div>
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

		&.marquee {
			border: 1px solid var(--accent-color-2);
			background: var(--spark-background-color);

			&:hover,
			&.open {
				border-color: var(--accent-color-2);
			}

			.lever-label {
				color: var(--accent-color-2);
			}
		}

		.lever-label {
			flex: 0 0 auto;
			color: var(--tertiary-color);
			font-size: var(--font-size-md);
			font-weight: 700;
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

	.sub-lever {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);

		&:not(:last-child) {
			margin-bottom: var(--spacing-md);
		}

		.sub-label {
			color: var(--tertiary-color);
			font-size: var(--font-size-md);
			font-weight: 600;
		}

		.chip-row {
			display: flex;
			flex-wrap: wrap;
			gap: var(--tap-gap-min);
		}
	}
</style>
