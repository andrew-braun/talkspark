<script lang="ts">
	export let isLoading: boolean = false
</script>

<div class="loading-container">
	{#if isLoading}
		<div class="loading-animation" />
	{/if}
</div>

<style lang="scss">
	.loading-container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;

		.loading-animation {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			border: 6px solid var(--accent-color-3);
			border-top-color: var(--accent-color-1);
			animation: spin 1s infinite linear;
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
