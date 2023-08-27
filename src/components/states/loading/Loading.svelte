<script lang="ts">
	import type { AnimationType } from "ts/animation"
	import LoadingAnimation from "components/states/loading/LoadingAnimation.svelte"

	export let isLoading: boolean = false
	export let animation: AnimationType
</script>

<div class="loading-container">
	{#if isLoading}
		<LoadingAnimation {animation} />
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
	}
</style>
