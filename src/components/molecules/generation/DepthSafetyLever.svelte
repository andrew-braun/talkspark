<script lang="ts">
	import Popover from 'components/atoms/overlays/Popover.svelte';
	import Chip from 'components/atoms/buttons/Chip.svelte';
	import {
		DEPTH_LEVEL_MIN,
		DEPTH_LEVEL_MAX,
		CONTROVERSY_LEVEL_MIN,
		CONTROVERSY_LEVEL_MAX,
	} from 'lib/data/generation-options';
	import type { DepthAndSafety } from 'ts/params';

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
</script>

<!-- Marquee control: depth & safety is the clearest differentiator (generation-engine.md),
     so its pill stays visually distinct even collapsed. -->
<Popover placement="bottom-start">
	{#snippet trigger({ triggerProps, open })}
		<button {...triggerProps} class="lever-pill marquee" class:open>
			<span class="lever-label">Depth &amp; safety</span>
			<span class="lever-value"
				>Depth {value.depth_level} · Controversy {value.controversy_level}</span
			>
		</button>
	{/snippet}

	{#snippet content()}
		<!-- Two sub-choices live under one lever, so the popover stays open across both
		     selections — closes on outside click / Escape / re-tap. -->
		<div class="sub-lever">
			<span class="sub-label">Depth</span>
			<div class="chip-row">
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
			color: var(--tertiary-color);
			font-size: var(--font-size-xs);
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.05em;
		}

		.lever-value {
			font-size: var(--font-size-sm);
			font-weight: 500;
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
			font-size: var(--font-size-xs);
		}

		.chip-row {
			display: flex;
			flex-wrap: wrap;
			gap: var(--tap-gap-min);
		}
	}
</style>
