<script lang="ts">
	import Button from "components/buttons/Button.svelte"
	import { generatedSparks } from "stores/starters/generated-sparks"
	import { getSpark, type GetSparkResponse } from "lib/client/gpt/chat"

	import type { Spark } from "ts/sparks"

	let currentSparks: Spark[] = []

	generatedSparks.subscribe((sparks) => {
		currentSparks = sparks
	})

	const handleRandomSparkInitiate = async () => {
		const promptResponse: GetSparkResponse = await getSpark({
			type: "random",
		})

		const { sparks } = promptResponse

		generatedSparks.update((currentSparks) => {
			return [...currentSparks, ...sparks]
		})
	}
</script>

<Button style="primary" onClick={handleRandomSparkInitiate}
	>Random Sparks</Button
>

<ol class="response-container">
	{#each currentSparks as spark}
		<li class="spark">{spark.content}</li>
	{/each}
</ol>
