<script lang="ts">
	import type { SparkData } from "ts/sparks"
	import Spark from "components/sparks/Spark.svelte"

	export let sparks: SparkData[] = []
</script>

<div class="response-container">
	{#each sparks.reverse() as spark, index}
		<Spark {spark} index={(Math.floor(index) % 4) + 1} />
	{/each}
</div>
