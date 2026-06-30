<script lang="ts">
	import type { SparkData } from "ts/sparks"
	import { generatedSparks } from "stores/sparks.svelte"
	import Spark from "components/molecules/sparks/Spark.svelte"
	import { sortByDate } from "lib/utils/sort"
	import Button from "components/atoms/buttons/Button.svelte"

	let {
		sparks = [],
		sparkStore = generatedSparks,
		clearButton = false,
	}: {
		sparks?: SparkData[]
		sparkStore?: typeof generatedSparks
		clearButton?: boolean
	} = $props()

	let sortedSparks = $derived(
		sortByDate({ objects: sparks, dateField: "created_at", direction: "DESC" })
	)
</script>

<div class="sparks">
	<div class="response-container">
		<div class="actions">
			{#if clearButton}
				<Button
					type="reset"
					style="basic"
					classes="clear-button"
					onClick={() => sparkStore.clear()}>Clear All</Button
				>
			{/if}
		</div>

		{#each sortedSparks as spark, index}
			<Spark {spark} index={(Math.floor(index) % 4) + 1} />
		{/each}
	</div>
</div>

<style lang="scss">
	.sparks {
		flex: 1 1 auto;
		display: flex;
		justify-content: center;
		width: 100%;
		margin-top: var(--spacing-md);
		&:global(.clear-button) {
			margin-left: auto;
		}
		.response-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: max-content;

			.actions {
				display: flex;
				justify-content: flex-end;
				width: 100%;
			}
		}
	}
</style>
