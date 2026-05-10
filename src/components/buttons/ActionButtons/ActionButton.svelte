<script lang="ts">
	import type { Snippet } from "svelte"
	import ActionButtonPopup from "./ActionButtonPopup.svelte"

	let {
		onClick,
		title,
		type,
		isPopupActive = false,
		children,
		popup,
	}: {
		onClick: () => void
		title: string
		type: "copy" | "save"
		isPopupActive?: boolean
		children?: Snippet
		popup?: Snippet
	} = $props()
</script>

<button
	class={`action ${type}`}
	{title}
	onclick={() => onClick()}
>
	{@render children?.()}
</button>

<ActionButtonPopup show={isPopupActive}>
	{@render popup?.()}
</ActionButtonPopup>

<style lang="scss">
	.action {
		position: relative;
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
