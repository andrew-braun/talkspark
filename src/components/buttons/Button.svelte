<script lang="ts">
	export let type: "button" | "submit" | "reset" = "button"
	export let style:
		| "primary"
		| "secondary"
		| "tertiary"
		| "danger"
		| "warning"
		| "success"
		| "info"
		| "light"
		| "dark" = "primary"
	export let disabled: boolean = false
	export let onClick: () => void
	export let classes: string = ""
</script>

<button
	{type}
	{disabled}
	on:click={onClick}
	class={`general-button style-${style} ${classes}`}
>
	<slot />
</button>

<style lang="scss">
	.general-button {
		padding: var(--spacing-sm) var(--spacing-md);
		outline: 2px solid transparent;
		border: none;
		border-radius: var(--border-radius-md);
		background: var(--accent-color-1);
		font-size: var(--font-size-md);
		font-weight: 500;
		transition: var(--transition-std);

		&:hover {
			cursor: pointer;
			outline: 2px solid var(--accent-color-3);
		}
	}
</style>
