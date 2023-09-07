<script lang="ts">
	// import { createPopper } from "@popperjs/core"

	// Props
	export let onClick: () => void
	export let title: string
	export let type: "copy" | "save"
</script>

<button class={`action ${type}`} {title} on:click={onClick}>
	<slot />
</button>

<style lang="scss">
	.action {
		border: none;
		background: transparent;
		color: var(--text-light);
		margin: var(--spacing-xs) 0;

		&:hover {
			cursor: pointer;
		}
		&:active {
			transform: scale(0.9);
		}
	}
</style>
