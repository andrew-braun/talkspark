<script lang="ts">
	import type { Snippet } from 'svelte';
	import ActionButtonPopup from 'components/atoms/actions/ActionButtonPopup.svelte';

	let {
		onClick,
		title,
		type,
		isPopupActive = false,
		children,
		popup,
	}: {
		onClick: () => void;
		title: string;
		type: 'copy' | 'save';
		isPopupActive?: boolean;
		children?: Snippet;
		popup?: Snippet;
	} = $props();
</script>

<!-- The popup is positioned against this wrapper. It used to sit as a sibling of the
     button with no positioned ancestor of its own, so it anchored to the whole spark
     card instead of to the control that spawned it. -->
<div class="action-wrapper">
	<button class={`action ${type}`} {title} onclick={() => onClick()}>
		{@render children?.()}
	</button>

	<ActionButtonPopup show={isPopupActive}>
		{@render popup?.()}
	</ActionButtonPopup>
</div>

<style lang="scss">
	.action-wrapper {
		position: relative;
		display: inline-flex;
	}

	.action {
		display: inline-flex;
		align-items: center;
		justify-content: center;

		// The icon stays 24px; the button grows around it to a real fingertip target.
		min-width: var(--tap-target-min);
		min-height: var(--tap-target-min);
		padding: 0;
		border: none;
		background: transparent;
		color: var(--text-color-light);

		&:hover {
			cursor: pointer;
		}

		&:active {
			transform: scale(0.9);
		}
	}
</style>
