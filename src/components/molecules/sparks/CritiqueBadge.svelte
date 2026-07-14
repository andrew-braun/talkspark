<script lang="ts">
	import Popover from 'components/atoms/overlays/Popover.svelte';
	import type { CritiqueResult } from 'ts/critique';

	let {
		critique,
		gradientIndex = 1,
	}: {
		critique: CritiqueResult;
		gradientIndex?: number;
	} = $props();

	const gateLabels = [
		{ key: 'clarity', label: 'Clarity' },
		{ key: 'answerability', label: 'Answer' },
		{ key: 'context_fit', label: 'Context' },
		{ key: 'safety', label: 'Safety' },
	] as const;

	const summary = $derived(
		`Critique: ${critique.passed ? 'passed' : 'failed'}. Clarity ${critique.scores.clarity}, answerability ${critique.scores.answerability}, context ${critique.scores.context_fit}, safety ${critique.scores.safety}`
	);
</script>

<!-- The scores used to live in a CSS `:hover` panel, which made them unreachable on
     touch — a phone has no hover, so the panel never opened at all. It's a Zag popover
     now: tap to open, outside-tap / Escape to dismiss. -->
<div class="critique-badge-root" style:--badge-gradient={`var(--gradient-${gradientIndex})`}>
	<Popover placement="bottom-start">
		{#snippet trigger({ triggerProps, open })}
			<button
				{...triggerProps}
				class="critique-badge"
				class:passed={critique.passed}
				class:failed={!critique.passed}
				class:open
				aria-label={summary}
			>
				<span class="pill">{critique.passed ? 'Pass' : 'Fail'}</span>
			</button>
		{/snippet}

		{#snippet content()}
			<div class="scores">
				{#each gateLabels as gate (gate.key)}
					<span class="score">
						<span class="label">{gate.label}</span>
						<span class="value">{critique.scores[gate.key]}</span>
					</span>
				{/each}
			</div>
		{/snippet}
	</Popover>
</div>

<style lang="scss">
	.critique-badge-root {
		display: flex;
		align-self: flex-start;
	}

	.critique-badge {
		display: inline-flex;
		align-items: center;

		// The hit area is a full 44px square while the pill inside stays visually small —
		// the target grows, the design doesn't. min-width matters because the "Fail" label
		// is narrower than "Pass" and would otherwise fall under the floor on its own.
		justify-content: center;
		min-width: var(--tap-target-min);
		min-height: var(--tap-target-min);
		padding: 0;
		border: none;
		background: transparent;
		text-align: left;
		cursor: pointer;

		.pill {
			display: inline-block;
			padding: var(--spacing-xs) var(--spacing-sm);
			border-radius: var(--border-radius-xl);
			font-size: var(--font-size-xs);
			font-weight: 600;
			line-height: 1;
			text-transform: uppercase;
			letter-spacing: 0.04em;
			transition: var(--transition-std);
		}

		&.passed .pill {
			background: var(--badge-gradient);
			color: var(--text-color-dark);
		}

		&.failed .pill {
			background: var(--accent-color-2);
			color: var(--text-color-light);
		}

		&.open .pill,
		&:hover .pill {
			opacity: 0.85;
		}
	}

	.scores {
		display: flex;
		gap: var(--spacing-sm);

		.score {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: var(--spacing-xs);
			min-width: 4.8rem;
		}

		.label {
			color: var(--text-color-light);
			font-size: var(--font-size-xs);
			opacity: 0.8;
		}

		.value {
			color: var(--text-color-light);
			font-size: var(--font-size-sm);
			font-weight: 600;
		}
	}
</style>
