<script lang="ts">
	interface Props {
		label: string;
		selected?: boolean;
		onClick?: () => void;
		// Optional lever accent token (e.g. '--lever-who'). When set, a selected chip fills
		// with that hue instead of the default gradient, so a chip reads as part of its lever.
		colorVar?: string;
		// Muted variant for the "Default" / unset option: dim when idle, a neutral highlight
		// (not an accent) when selected, so default never looks like an active choice.
		muted?: boolean;
	}

	let { label, selected = false, onClick, colorVar, muted = false }: Props = $props();

	// Feed the chosen accent into both the fill and the border via local custom properties;
	// each falls back to the default look when no colorVar is passed.
	const accentStyle = $derived(
		colorVar ? `--chip-fill: var(${colorVar}); --chip-accent: var(${colorVar})` : undefined
	);

	// The accent wash is selection feedback, so it should play only when a chip becomes
	// selected after mount — not replay every time the sheet remounts an already-selected chip.
	let wash = $state(false);
	let wasSelected: boolean | undefined;
	$effect(() => {
		if (wasSelected !== undefined) {
			if (selected && !wasSelected) wash = true;
			else if (!selected) wash = false;
		}
		wasSelected = selected;
	});
</script>

<button
	type="button"
	class="chip"
	class:selected
	class:muted
	class:wash
	style={accentStyle}
	aria-pressed={selected}
	onclick={onClick}
>
	{label}
</button>

<style lang="scss">
	.chip {
		--interaction-accent: var(--chip-accent, var(--accent-color-5));

		display: inline-flex;
		align-items: center;
		justify-content: center;

		// min-width matters as much as min-height here: the depth/controversy chips are
		// single digits, so without it they'd be 44px tall and ~20px wide.
		min-width: var(--tap-target-min);
		min-height: var(--tap-target-min);
		padding: var(--spacing-sm) var(--spacing-lg);
		border: 1px solid var(--tertiary-color);
		border-radius: var(--border-radius-xl);
		background: transparent;
		color: var(--text-color-light);
		font-size: var(--font-size-md);

		// Weight is constant across selected/unselected on purpose: only colour and fill
		// change on selection, so a chip never grows and reflows the row when tapped.
		font-weight: 500;
		line-height: 1;
		transition:
			transform var(--motion-press) var(--ease-out),
			filter var(--motion-feedback) ease,
			opacity var(--motion-feedback) ease;

		&:hover {
			cursor: pointer;
			border-color: var(--chip-accent, var(--accent-color-5));
		}

		&:active:not(:disabled) {
			transform: scale(0.96);
		}

		&:focus-visible {
			outline: 2px solid var(--accent-color-5);
			outline-offset: 2px;
		}

		&.selected {
			border-color: transparent;
			background: var(--chip-fill, var(--gradient-1));
			color: var(--chip-selected-ink);

			&.wash:not(.muted) {
				animation: accentWash var(--motion-feedback) ease-out;
			}
		}

		// The unset baseline: dim while idle, a neutral highlight (never an accent) when chosen.
		&.muted {
			color: var(--tertiary-color);

			&.selected {
				background: var(--chip-muted-fill);
				color: var(--text-color-light);
			}
		}

		@media (prefers-reduced-motion: reduce) {
			transition-duration: var(--motion-reduced);

			&:active:not(:disabled) {
				transform: none;
			}

			&.selected.wash:not(.muted) {
				animation-duration: var(--motion-reduced);
			}
		}
	}
</style>
