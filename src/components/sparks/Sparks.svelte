<script lang="ts">
	import type { SparkData } from "ts/sparks"
	import Spark from "components/sparks/Spark.svelte"
	import { sortByDate } from "lib/utils/sort"

	export let sparks: SparkData[] = []

	$: sortedSparks = sortByDate({
		objects: sparks,
		dateField: "created_at",
		direction: "DESC",
	})
</script>

<div class="response-container">
	{#each sortedSparks as spark, index}
		<Spark {spark} index={(Math.floor(index) % 4) + 1} />
	{/each}
</div>

<style lang="scss">
	.response-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}
</style>
