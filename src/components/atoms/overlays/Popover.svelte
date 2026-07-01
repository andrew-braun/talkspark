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

<div class="popover-root">
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
	.popover-root {
		display: inline-flex;
	}

	.popover-content {
		padding: var(--spacing-sm);
		border: var(--spark-border);
		border-radius: var(--border-radius-lg);
		background: var(--spark-background-color);
		box-shadow: 0 4px 16px rgb(0 0 0 / 35%);
	}
</style>
