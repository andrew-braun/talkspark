<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	let { show = false, children }: { show?: boolean; children?: Snippet } = $props();
</script>

{#if show}
	<div class={`popup ${show ? 'show' : 'hide'}`} transition:fade>
		{@render children?.()}
	</div>
{/if}

<style lang="scss">
	.popup {
		position: absolute;
		z-index: 50;
		top: -1.6em;
		right: -10px;
		background: var(--accent-color-6);
		border-radius: var(--border-radius-sm);
		padding: var(--spacing-xs);
		color: var(--text-color-dark);
		box-shadow: var(--box-shadow);
		opacity: 0.85;

		&.hide {
			visibility: hidden;
		}

		&.show {
			visibility: visible;
		}
	}
</style>
