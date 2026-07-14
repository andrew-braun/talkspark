<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		type?: 'button' | 'submit' | 'reset';
		variant?:
			| 'basic'
			| 'primary'
			| 'secondary'
			| 'tertiary'
			| 'danger'
			| 'warning'
			| 'success'
			| 'info'
			| 'light'
			| 'dark';
		disabled?: boolean;
		isLoading?: boolean;
		loadingText?: string;
		onClick?: () => void;
		classes?: string;
		children?: Snippet;
	}

	let {
		type = 'button',
		variant = 'primary',
		disabled = false,
		isLoading = false,
		loadingText = 'Loading...',
		onClick,
		classes = '',
		children,
	}: Props = $props();
</script>

<button
	{type}
	{disabled}
	onclick={onClick}
	class={`general-button variant-${variant} ${classes} ${isLoading ? 'loading' : ''}`}
>
	{#if isLoading}
		{loadingText}
	{:else if children}
		{@render children()}
	{/if}
</button>

<style lang="scss">
	.general-button {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;

		// Primary actions get the larger target — this is the button the whole app exists
		// to have you press.
		min-height: var(--tap-target-lg);
		padding: var(--spacing-sm) var(--spacing-md);
		border: none;
		border-radius: var(--border-radius-lg);
		background: var(--accent-color-1);
		font-size: var(--font-size-md-lg);
		font-weight: 600;
		transition: var(--transition-std);

		// Full-bleed on a phone; only capped once there's a desktop's worth of room.
		@media (width >= 768px) {
			max-width: 320px;
		}

		&:hover {
			cursor: pointer;
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 1;
			color: var(--text-color-dark);
		}

		&.variant-primary {
			background: var(--gradient-1);
		}

		&.variant-basic {
			width: max-content;
			min-height: var(--tap-target-min);
			padding: var(--spacing-sm) var(--spacing-lg);
			background: transparent;
			border: 1px solid var(--accent-color-2);
			color: var(--text-color-light);
			font-weight: 400;
			line-height: 1;
			text-decoration: underline;
			font-size: var(--font-size-md);
		}

		&.loading {
			background: var(--gradient-5);
			background-size: 400% 400%;
			animation: gradientMotion 3s ease infinite;
		}
	}
</style>
