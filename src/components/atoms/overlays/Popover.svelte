<script lang="ts">
	import * as popover from '@zag-js/popover';
	import { useMachine, normalizeProps } from '@zag-js/svelte';
	import type { Snippet } from 'svelte';
	import type { Placement } from '@zag-js/popover';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	// Thin wrapper around Zag's popover state machine — the standard primitive for any
	// non-native floating UI in this app (dropdown-style pickers, menus, etc.).
	let {
		placement = 'bottom-start',
		trigger,
		content,
	}: {
		placement?: Placement;
		trigger: Snippet<[{ triggerProps: HTMLButtonAttributes; open: boolean }]>;
		content: Snippet<[{ close: () => void }]>;
	} = $props();

	const id = $props.id();
	const service = useMachine(popover.machine, () => ({
		id,
		portalled: false,
		positioning: { placement },
	}));
	const api = $derived(popover.connect(service, normalizeProps));
</script>

<div class="popover-root" class:open={api.open}>
	{@render trigger({ triggerProps: api.getTriggerProps(), open: api.open })}
	{#if api.open}
		<div {...api.getPositionerProps()} class="popover-positioner">
			<div {...api.getContentProps()} class="popover-content">
				{@render content({ close: () => api.setOpen(false) })}
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	// Zag writes `z-index: var(--z-index)` inline on the positioner with `--z-index: auto`,
	// so styling the positioner directly can't win without `!important`. Raising the root
	// instead gives the whole popover subtree a stacking context above the spark cards,
	// which are positioned at `z-index: auto` and would otherwise paint over it by DOM order.
	// Only the *open* popover lifts: if every root sat at z-index 50, sibling levers would
	// tie on z-index and DOM order would let later pills paint over an open panel.
	.popover-root {
		position: relative;
		display: inline-flex;

		&.open {
			z-index: 50;
		}
	}

	.popover-content {
		// Now that chips are real 44px targets these panels are much bigger, so the
		// content is clamped to the viewport and scrolls rather than spilling off a phone.
		max-width: min(360px, calc(100vw - var(--spacing-xl)));
		max-height: 60dvh;
		overflow-y: auto;
		padding: var(--spacing-sm);
		border: var(--spark-border);
		border-radius: var(--border-radius-lg);
		background: var(--spark-background-color);
		box-shadow: var(--box-shadow);
	}
</style>
