<script lang="ts">
	import type { SparkData } from "ts/sparks"
	import Spark from "components/sparks/Spark.svelte"
	import { sortByDate } from "lib/utils/sort"

	export let sparks: SparkData[] = []

	$: sortedSparks = sortByDate({ objects: sparks, dateField: "created_at" })
</script>

<div class="response-container">
	{#each sortedSparks.reverse() as spark, index}
		<Spark {spark} index={(Math.floor(index) % 4) + 1} />
	{/each}
</div>
