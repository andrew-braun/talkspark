<script lang="ts">
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
</script>

<button
	type="button"
	class="critique-badge"
	class:passed={critique.passed}
	class:failed={!critique.passed}
	style:--badge-gradient={`var(--gradient-${gradientIndex})`}
	aria-label={`Critique: ${critique.passed ? 'passed' : 'failed'}. Clarity ${critique.scores.clarity}, answerability ${critique.scores.answerability}, context ${critique.scores.context_fit}, safety ${critique.scores.safety}`}
>
	<span class="pill">{critique.passed ? 'Pass' : 'Fail'}</span>
	<div class="scores" aria-hidden="true">
		{#each gateLabels as gate (gate.key)}
			<span class="score">
				<span class="label">{gate.label}</span>
				<span class="value">{critique.scores[gate.key]}</span>
			</span>
		{/each}
	</div>
</button>

<style lang="scss">
	.critique-badge {
		position: relative;
		flex-shrink: 0;
		align-self: flex-start;
		margin-bottom: var(--spacing-xs);
		padding: 0;
		border: none;
		background: transparent;
		text-align: left;
		cursor: default;

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

		.scores {
			position: absolute;
			top: calc(100% + var(--spacing-xs));
			left: 0;
			z-index: 2;
			display: flex;
			gap: var(--spacing-sm);
			padding: var(--spacing-sm);
			border: var(--spark-border);
			border-radius: var(--border-radius-sm);
			background: var(--spark-background-color);
			opacity: 0;
			visibility: hidden;
			pointer-events: none;
			transition: var(--transition-std);
		}

		&:hover .scores,
		&:focus-within .scores {
			opacity: 1;
			visibility: visible;
		}

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
