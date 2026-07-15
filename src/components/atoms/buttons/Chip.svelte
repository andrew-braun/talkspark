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
</script>

<button
	type="button"
	class="chip"
	class:selected
	class:muted
	style={accentStyle}
	aria-pressed={selected}
	onclick={onClick}
>
	{label}
</button>

<style lang="scss">
	.chip {
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
		transition: var(--transition-std);

		&:hover {
			cursor: pointer;
			border-color: var(--chip-accent, var(--accent-color-5));
		}

		&.selected {
			border-color: transparent;
			background: var(--chip-fill, var(--gradient-1));
			color: var(--chip-selected-ink);
		}

		// The unset baseline: dim while idle, a neutral highlight (never an accent) when chosen.
		&.muted {
			color: var(--tertiary-color);

			&.selected {
				background: var(--chip-muted-fill);
				color: var(--text-color-light);
			}
		}
	}
</style>
