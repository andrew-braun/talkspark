<script lang="ts">
	export let type: "radio" | "checkbox" | null = null
</script>

<div class="input-label">
	<p class="input-label-primary-text">
		<slot />
	</p>
	{#if type === "radio"}
		<p class="input-label-secondary-text">(Choose One)</p>
	{/if}
</div>

<style lang="scss">
	.input-label {
		padding: var(--spacing-sm) 0;
		text-align: left;

		.input-label-primary-text {
			margin: 0 0 var(--spacing-xs) 0;
			font-size: var(--font-size-md-lg);
			font-weight: 500;
		}

		.input-label-secondary-text {
			margin: 0;
			padding: 0;
			font-size: var(--font-size-md);
		}
	}
</style>
