<script lang="ts">
	import { fly, slide } from "svelte/transition"
	import PageNavigation from "./PageNavigation.svelte"

	export let pages: any[]

	let currentPage = 0
	$: currentPageProps = pages[currentPage].props
	$: currentPageComponent = pages[currentPage].component

	let transitionDirection = 1

	const handleNextPage = () => {
		transitionDirection = 1

		if (currentPage < pages.length - 1) {
			currentPage += 1
		}
	}

	const handlePreviousPage = () => {
		transitionDirection = -1

		if (currentPage > 0) {
			currentPage -= 1
		}
	}
</script>

<div class="pages-container">
	{#key currentPage}
		<div
			class="page"
			in:fly={{
				delay: 100,
				duration: 250,
				x: `${(transitionDirection * 100).toString()}%`,
				// opacity: 0,
			}}
			out:fly={{
				duration: 250,
				x: `${(transitionDirection * -100).toString()}%`,
				// opacity: 0,
			}}
		>
			<svelte:component
				this={currentPageComponent}
				props={currentPageProps}
				{currentPage}
			/>
		</div>
	{/key}
	<div class="controls">
		<PageNavigation {handleNextPage} {handlePreviousPage} />
	</div>
</div>

<style lang="scss">
	.pages-container {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		width: 100%;
		height: 80vh;
		overflow: hidden;

		.page {
			display: flex;
			position: absolute;
			justify-content: center;
			align-items: flex-start;
			width: 100%;
			height: 80%;
		}
		.controls {
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 20%;
			background: var(--background-color);
		}
	}
</style>
