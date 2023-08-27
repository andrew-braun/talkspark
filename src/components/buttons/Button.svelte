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
	export let isLoading: boolean = false
	export let loadingText: string = "Loading..."
	export let onClick: () => void
	export let classes: string = ""
</script>

<button
	{type}
	{disabled}
	on:click={onClick}
	class={`general-button style-${style} ${classes} ${
		isLoading ? "loading" : ""
	}`}
>
	{#if isLoading}
		{loadingText}
	{:else}
		<slot />
	{/if}
</button>

<style lang="scss">
	.general-button {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		max-width: 320px;
		min-height: 38px;
		padding: var(--spacing-sm) var(--spacing-md);
		border: none;
		border-radius: var(--border-radius-lg);
		background: var(--accent-color-1);
		font-size: var(--font-size-md-lg);
		font-weight: 600;
		transition: var(--transition-std);

		&:hover {
			cursor: pointer;
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.7;
			color: var(--text-color-dark);
		}

		&.style-primary {
			background: var(--gradient-1);
		}

		&.loading {
			background: var(--gradient-5);
			background-size: 400% 400%;
			animation: gradientMotion 3s ease infinite;
		}
	}
</style>
