<script lang="ts">
	import IoArrowBack from "lib/assets/icons/IoArrowBack.svg?component"
	import IoArrowForwards from "lib/assets/icons/IoArrowForwards.svg?component"
	import ActionButton from "components/buttons/ActionButtons/ActionButton.svelte"
	import ProgressBar from "components/data/ProgressBar.svelte"

	export let currentPageIndex: number
	export let totalPages: number
	export let handleNextPage: () => void
	export let handlePreviousPage: () => void

	$: progress = (currentPageIndex + 1 / totalPages) * 100
</script>

<div class="page-navigation">
	<span class="pagination-button-wrapper">
		<ActionButton type="basic" title="previous" onClick={handlePreviousPage}>
			<span class="pagination-button-content">
				<IoArrowBack width="24" height="24" />
				<span class="pagination-button-text">Back</span>
			</span>
		</ActionButton>
	</span>
	<span class="pagination-button-wrapper">
		<ActionButton type="basic" title="next" onClick={handleNextPage}>
			<span class="pagination-button-content">
				<span class="pagination-button-text">Next</span>
				<IoArrowForwards width="24" height="24" />
			</span>
		</ActionButton>
	</span>
</div>
<ProgressBar {progress} />
<div class="page-numbers">
	<span class="page-number">{currentPageIndex + 1}</span>
	/
	<span class="page-number">{totalPages}</span>
</div>

<style lang="scss">
	.page-navigation {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-sm);
		.pagination-button-wrapper {
			.pagination-button-content {
				display: flex;
				align-items: center;
				color: var(--text-color-light);
				font-size: var(--font-size-md);
				font-weight: 500;

				.pagination-button-text {
					margin: 0 var(--spacing-xs);
				}
			}
		}
	}

	.page-numbers {
		margin-top: var(--spacing-sm);
	}
</style>
