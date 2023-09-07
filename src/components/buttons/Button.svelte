<script lang="ts">
	export let type: "button" | "submit" | "reset" = "button"
	export let style:
		| "basic"
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
</script>

<button
	{type}
	{disabled}
	on:click={onClick}
	class={`general-button style-${style} ${$$restProps.classes} ${
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
			opacity: 1;
			color: var(--text-color-dark);
		}

		&.style-primary {
			background: var(--gradient-1);
		}

		&.style-basic {
			width: max-content;
			min-height: 24px;
			background: transparent;
			border: 1px solid var(--accent-color-2);
			color: var(--text-color-light);
			font-weight: 400;
			line-height: 1;
			text-decoration: underline;
			font-size: var(--font-size-md-sm);
		}

		&.loading {
			background: var(--gradient-5);
			background-size: 400% 400%;
			animation: gradientMotion 3s ease infinite;
		}
	}
</style>
