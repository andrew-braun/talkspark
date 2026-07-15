<script lang="ts">
	import Chip from 'components/atoms/buttons/Chip.svelte';
	import { DEFAULT_LEVER_VALUE } from 'ts/params';
	import { isLeverSet, type LeverFieldDef, type LeverValue } from 'lib/data/generation-options';

	// One lever inside the Customize sheet: a header (dot + name + current value) over a
	// wrapping row of option chips. Handles both select levers and the depth/controversy
	// scales — the 16px control-text floor rules out a cramped 7-segment bar on a phone, so
	// both render as the same chip row (the "Default" option is the muted, unset baseline).
	let {
		field,
		value,
		onSelect,
	}: {
		field: LeverFieldDef;
		value: LeverValue;
		onSelect: (value: LeverValue) => void;
	} = $props();

	interface DisplayOption {
		value: LeverValue;
		label: string;
		muted: boolean;
	}

	const displayOptions: DisplayOption[] = $derived(
		field.kind === 'select'
			? field.options.map((option) => ({
					value: option.value,
					label: option.label,
					muted: option.value === DEFAULT_LEVER_VALUE,
				}))
			: [
					{ value: DEFAULT_LEVER_VALUE, label: 'Default', muted: true },
					...Array.from(
						{ length: field.max - field.min + 1 },
						(_, i) => field.min + i
					).map((level) => ({ value: level, label: field.labels[level], muted: false })),
				]
	);

	const isSet = $derived(isLeverSet(value));
	const currentLabel = $derived(
		displayOptions.find((option) => option.value === value)?.label ?? 'Default'
	);
</script>

<section
	class="lever-field"
	class:set={isSet}
	id={`lever-field-${field.key}`}
	style={`--fc: var(${field.colorVar})`}
>
	<div class="field-head">
		<span class="dot" aria-hidden="true"></span>
		<span class="field-name">{field.sheetName}</span>
		<span class="field-value">{currentLabel}</span>
	</div>

	<div class="chips" role="group" aria-label={field.sheetName}>
		{#each displayOptions as option (option.value)}
			<Chip
				label={option.label}
				selected={value === option.value}
				muted={option.muted}
				colorVar={option.muted ? undefined : field.colorVar}
				onClick={() => onSelect(option.value)}
			/>
		{/each}
	</div>
</section>

<style lang="scss">
	.lever-field {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);

		.field-head {
			display: flex;
			align-items: center;
			gap: var(--spacing-sm);

			.dot {
				width: 10px;
				height: 10px;
				flex: 0 0 auto;
				border: 1px solid var(--tertiary-color);
				border-radius: 50%;
				background: transparent;
				transition: var(--transition-std);
			}

			.field-name {
				color: var(--text-color-light);
				font-size: var(--font-size-md);
				font-weight: 700;
			}

			// Non-interactive summary of the current pick, so it may sit below the control floor.
			.field-value {
				margin-left: auto;
				color: var(--tertiary-color);
				font-size: var(--font-size-md-sm);
			}
		}

		.chips {
			display: flex;
			flex-wrap: wrap;
			gap: var(--tap-gap-min);
		}

		// Set state: the dot and value take on the lever's own accent so a glance down the
		// sheet shows which levers are active and in what colour.
		&.set {
			.dot {
				border-color: var(--fc);
				background: var(--fc);
			}

			.field-value {
				color: var(--fc);
				font-weight: 600;
			}
		}
	}
</style>
