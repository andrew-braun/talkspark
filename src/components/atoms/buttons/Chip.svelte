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
		padding: var(--spacing-xs) var(--spacing-md);
		border: 1px solid var(--tertiary-color);
		border-radius: var(--border-radius-xl);
		background: transparent;
		color: var(--text-color-light);
		font-size: var(--font-size-sm);
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
