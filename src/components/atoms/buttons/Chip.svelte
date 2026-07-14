<script lang="ts">
	interface Props {
		label: string;
		selected?: boolean;
		onClick?: () => void;
	}

	let { label, selected = false, onClick }: Props = $props();
</script>

<button type="button" class="chip" class:selected aria-pressed={selected} onclick={onClick}>
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
		font-weight: 500;
		line-height: 1;
		transition: var(--transition-std);

		&:hover {
			cursor: pointer;
			border-color: var(--accent-color-5);
		}

		&.selected {
			border-color: transparent;
			background: var(--gradient-1);
			color: var(--text-color-dark);
		}
	}
</style>
