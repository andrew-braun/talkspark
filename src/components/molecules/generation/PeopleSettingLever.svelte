<script lang="ts">
	import Popover from 'components/atoms/overlays/Popover.svelte';
	import Chip from 'components/atoms/buttons/Chip.svelte';
	import type { LeverOption } from 'lib/data/generation-options';
	import type { RelationshipContext, Setting } from 'ts/spark';

	let {
		relationshipOptions,
		settingOptions,
		relationshipValue,
		settingValue,
		onSelectRelationship,
		onSelectSetting,
	}: {
		relationshipOptions: LeverOption<RelationshipContext>[];
		settingOptions: LeverOption<Setting>[];
		relationshipValue: RelationshipContext | undefined;
		settingValue: Setting | undefined;
		onSelectRelationship: (value: RelationshipContext) => void;
		onSelectSetting: (value: Setting) => void;
	} = $props();

	const relationshipLabel = $derived(
		relationshipOptions.find((o) => o.value === relationshipValue)?.label ?? 'Who'
	);
	const settingLabel = $derived(
		settingOptions.find((o) => o.value === settingValue)?.label ?? 'Where'
	);
</script>

<Popover placement="bottom-start">
	{#snippet trigger({ triggerProps, open })}
		<button {...triggerProps} class="lever-pill" class:open>
			<span class="lever-label">People &amp; setting</span>
			<span class="lever-value">{relationshipLabel} · {settingLabel}</span>
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
			<span class="sub-label">Where</span>
			<div class="chip-row">
				{#each settingOptions as option (option.value)}
					<Chip
						label={option.label}
						selected={settingValue === option.value}
						onClick={() => onSelectSetting(option.value)}
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
