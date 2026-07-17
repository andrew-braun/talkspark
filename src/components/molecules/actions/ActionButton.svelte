<script lang="ts">
	import type { Snippet } from 'svelte';
	import ActionButtonPopup from 'components/atoms/actions/ActionButtonPopup.svelte';

	let {
		onClick,
		title,
		type,
		active = false,
		isPopupActive = false,
		children,
		popup,
	}: {
		onClick: () => void;
		title: string;
		type: 'copy' | 'save';
		active?: boolean;
		isPopupActive?: boolean;
		children?: Snippet;
		popup?: Snippet;
	} = $props();
</script>

<!-- The popup is positioned against this wrapper. It used to sit as a sibling of the
     button with no positioned ancestor of its own, so it anchored to the whole spark
     card instead of to the control that spawned it. -->
<div class="action-wrapper">
	<!-- aria-pressed only for the save toggle: copy's active state is transient feedback,
	     not an on/off control, so announcing it as pressed would mislead. -->
	<button
		class={`action ${type}`}
		class:active
		{title}
		aria-pressed={type === 'save' ? active : undefined}
		onclick={() => onClick()}
	>
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
		transition:
			transform var(--motion-press) var(--ease-out),
			color var(--motion-feedback) ease;

		&:hover {
			cursor: pointer;
		}

		&:active {
			transform: scale(0.96);
		}

		&:focus-visible {
			outline: 2px solid var(--accent-color-5);
			outline-offset: 2px;
		}

		// Card-inherited accent: each spark card sets --spark-accent from its gradient.
		&.active {
			color: var(--spark-accent, var(--accent-color-5));
			animation: actionPop var(--motion-feedback) var(--ease-spring);
		}

		@media (prefers-reduced-motion: reduce) {
			transition-duration: var(--motion-reduced);

			&:active {
				transform: none;
			}

			&.active {
				animation-duration: var(--motion-reduced);
			}
		}
	}
</style>
