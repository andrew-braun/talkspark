<script lang="ts">
	import type { SparkData } from "ts/sparks"
	import Spark from "components/sparks/Spark.svelte"

	export let sparks: SparkData[] = []
</script>

<div class="response-container">
	{#each sparks as spark}
		<Spark {spark} />
	{/each}
</div>
