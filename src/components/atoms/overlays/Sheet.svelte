<script lang="ts">
	import * as dialog from '@zag-js/dialog';
	import { useMachine, normalizeProps, portal } from '@zag-js/svelte';
	import type { Snippet } from 'svelte';

	// Thin wrapper around Zag's dialog machine, presented as a bottom sheet. Zag owns focus
	// trap, Escape, outside-click dismiss, scroll lock, and ARIA; TalkSpark owns the look.
	// Controlled: the parent holds the open flag so other surfaces (a sentence word) can open
	// the sheet and aim focus at a specific lever.
	let {
		open,
		onOpenChange,
		title,
		initialFocusEl,
		headerActions,
		footer,
		content,
	}: {
		open: boolean;
		onOpenChange: (open: boolean) => void;
		title: string;
		initialFocusEl?: () => HTMLElement | null;
		headerActions?: Snippet;
		footer?: Snippet<[{ close: () => void }]>;
		content: Snippet<[{ close: () => void }]>;
	} = $props();

	const id = $props.id();
	const service = useMachine(dialog.machine, () => ({
		id,
		open,
		onOpenChange: (details) => onOpenChange(details.open),
		initialFocusEl,
	}));
	const api = $derived(dialog.connect(service, normalizeProps));
</script>

{#if api.open}
	<div use:portal class="sheet-portal">
		<div {...api.getBackdropProps()} class="sheet-backdrop"></div>
		<div {...api.getPositionerProps()} class="sheet-positioner">
			<div {...api.getContentProps()} class="sheet">
				<header class="sheet-head">
					<h2 {...api.getTitleProps()} class="sheet-title">{title}</h2>
					<div class="sheet-head-actions">
						{@render headerActions?.()}
						<button
							{...api.getCloseTriggerProps()}
							class="sheet-close"
							aria-label="Close customize"
						>
							✕
						</button>
					</div>
				</header>

				<div class="sheet-body">
					{@render content({ close: () => api.setOpen(false) })}
				</div>

				{#if footer}
					<footer class="sheet-footer">
						{@render footer({ close: () => api.setOpen(false) })}
					</footer>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.sheet-backdrop {
		position: fixed;
		inset: 0;
		z-index: 100;
		background: var(--scrim-color);
	}

	.sheet-positioner {
		position: fixed;
		inset: 0;
		z-index: 101;
		display: flex;
		align-items: flex-end;
		justify-content: center;

		// Desktop: float the sheet as a centred panel rather than pinning it to the edge.
		@media (width >= 768px) {
			align-items: center;
			padding: var(--spacing-xl);
		}
	}

	.sheet {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 640px;

		// Leave room above so the sheet never fills the whole screen — it reads as a panel,
		// not a takeover. A modest radius on the top corners only (not an iOS pill grabber).
		max-height: 85dvh;
		border: var(--spark-border);
		border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
		background: var(--spark-background-color);
		box-shadow: var(--box-shadow);

		@media (width >= 768px) {
			border-radius: var(--border-radius-lg);
		}
	}

	.sheet-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-md);
		padding: var(--spacing-md) var(--spacing-lg);

		// Brand gradient rule under the header instead of a plain divider.
		border-bottom: 2px solid transparent;
		border-image: var(--gradient-1) 1;

		.sheet-title {
			margin: 0;
			color: var(--text-color-light);
			font-size: var(--font-size-lg);
			font-weight: 700;
		}

		.sheet-head-actions {
			display: flex;
			align-items: center;
			gap: var(--spacing-sm);
		}

		.sheet-close {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			min-width: var(--tap-target-min);
			min-height: var(--tap-target-min);
			padding: 0;
			border: 1px solid var(--tertiary-color);
			border-radius: var(--border-radius-lg);
			background: transparent;
			color: var(--text-color-light);
			font-size: var(--font-size-md);
			line-height: 1;
			transition: var(--transition-std);

			&:hover {
				cursor: pointer;
				border-color: var(--accent-color-5);
			}
		}
	}

	.sheet-body {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
		padding: var(--spacing-lg);
		overflow-y: auto;
	}

	.sheet-footer {
		display: flex;
		justify-content: flex-end;
		padding: var(--spacing-md) var(--spacing-lg);

		// Respect the phone's home-indicator inset so the footer button stays reachable.
		padding-bottom: calc(var(--spacing-md) + env(safe-area-inset-bottom, 0px));
		border-top: 1px solid var(--tertiary-color);
	}
</style>
