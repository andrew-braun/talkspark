<script lang="ts">
	import IoArrowBack from "lib/assets/icons/IoArrowBack.svg?component"
	import IoArrowForwards from "lib/assets/icons/IoArrowForwards.svg?component"
	import ActionButton from "components/buttons/ActionButtons/ActionButton.svelte"

	export let handleNextPage: () => void
	export let handlePreviousPage: () => void
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

<style lang="scss">
	.page-navigation {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.pagination-button-wrapper {
			.pagination-button-content {
				display: flex;
				align-items: center;
				color: var(--text-color-light);
				font-size: var(--font-size-md);

				.pagination-button-text {
					margin: 0 var(--spacing-xs);
				}
			}
		}
	}
</style>
