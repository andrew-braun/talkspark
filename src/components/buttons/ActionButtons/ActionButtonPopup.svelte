<script lang="ts">
	import { afterUpdate } from "svelte"
	import { fade } from "svelte/transition"

	export let show: boolean = false
</script>

{#if show}
	<div class={`popup ${show ? "show" : "hide"}`} transition:fade>
		<slot />
	</div>
{/if}

<style lang="scss">
	.popup {
		position: absolute;
		top: -15px;
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
