<script lang="ts">
	import type { SparkData } from "ts/sparks"
	import { generated_sparks } from "stores/sparks/generated-sparks"
	import Spark from "components/sparks/Spark.svelte"
	import { sortByDate } from "lib/utils/sort"
	import Button from "components/buttons/Button.svelte"
	import { fade } from "svelte/transition"

	export let sparks: SparkData[] = []
	export let sparkStore = generated_sparks
	export let clearButton = false

	$: sortedSparks = sortByDate({
		objects: sparks,
		dateField: "created_at",
		direction: "DESC",
	})

	const handleSparksClear = () => {
		sparkStore.set([]) // clear all sparks
	}
</script>

<div class="sparks">
	<div class="response-container">
		<div class="actions">
			{#if clearButton}
				<Button
					type="reset"
					style="basic"
					classes="clear-button"
					onClick={handleSparksClear}>Clear All</Button
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
