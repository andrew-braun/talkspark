<script lang="ts">
	import type { SvelteComponent } from "svelte"
	import ActionButtonPopup from "./ActionButtonPopup.svelte"

	// Props
	export let onClick: () => void
	export let title: string
	export let type: "copy" | "save" | "utility"
	export let isPopupActive: boolean = false
</script>

<button
	class={`action ${type}`}
	{title}
	on:click={() => {
		onClick()
	}}
>
	<slot />
</button>

<ActionButtonPopup show={isPopupActive}>
	<slot name="popup" />
</ActionButtonPopup>

<style lang="scss">
	.action {
		position: relative;
		border: none;
		border-radius: var(--border-radius-sm);
		background: transparent;
		color: var(--text-color-light);
		margin: var(--spacing-xs) 0;

		&:hover {
			cursor: pointer;
		}
		&:active {
			transform: scale(0.9);
		}

		&.utility {
			background: var(--accent-color-1);
			color: var(--text-color-dark);
			margin: 0;
		}
	}
</style>
