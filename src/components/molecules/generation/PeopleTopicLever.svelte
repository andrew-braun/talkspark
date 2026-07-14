<script lang="ts">
	import Popover from 'components/atoms/overlays/Popover.svelte';
	import Chip from 'components/atoms/buttons/Chip.svelte';
	import type { LeverOption } from 'lib/data/generation-options';
	import type { LeverSelection } from 'ts/params';
	import type { RelationshipContext, TopicLens } from 'ts/spark';

	let {
		relationshipOptions,
		topicOptions,
		relationshipValue,
		topicValue,
		onSelectRelationship,
		onSelectTopic,
	}: {
		relationshipOptions: LeverOption<LeverSelection<RelationshipContext>>[];
		topicOptions: LeverOption<LeverSelection<TopicLens>>[];
		relationshipValue: LeverSelection<RelationshipContext> | undefined;
		topicValue: LeverSelection<TopicLens> | undefined;
		onSelectRelationship: (value: LeverSelection<RelationshipContext>) => void;
		onSelectTopic: (value: LeverSelection<TopicLens>) => void;
	} = $props();

	const relationshipLabel = $derived(
		relationshipOptions.find((o) => o.value === relationshipValue)?.label ?? 'Who'
	);
	const topicLabel = $derived(topicOptions.find((o) => o.value === topicValue)?.label ?? 'Topic');
</script>

<Popover placement="bottom-start">
	{#snippet trigger({ triggerProps, open })}
		<button {...triggerProps} class="lever-pill" class:open>
			<span class="lever-label">People &amp; topic</span>
			<span class="lever-value">{relationshipLabel} · {topicLabel}</span>
		</button>
	{/snippet}

	{#snippet content()}
		<!-- Two sub-choices live under one lever, so the popover stays open across both
		     selections (unlike single-value levers) — closes on outside click / Escape / re-tap. -->
		<div class="sub-lever">
			<span class="sub-label">Who</span>
			<div class="chip-row">
				{#each relationshipOptions as option (option.value)}
					<Chip
						label={option.label}
						selected={relationshipValue === option.value}
						onClick={() => onSelectRelationship(option.value)}
					/>
				{/each}
			</div>
		</div>

		<div class="sub-lever">
			<span class="sub-label">Topic</span>
			<div class="chip-row">
				{#each topicOptions as option (option.value)}
					<Chip
						label={option.label}
						selected={topicValue === option.value}
						onClick={() => onSelectTopic(option.value)}
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
