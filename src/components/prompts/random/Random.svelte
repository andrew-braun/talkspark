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

<div class="dialog-container">
	<Button style="primary" onClick={handleRandomSparkInitiate}
		>Random Sparks</Button
	>

	<ol class="response-container">
		{#each currentSparks as spark}
			<li class="spark">{spark.content}</li>
		{/each}
	</ol>
</div>

<style lang="scss">
	.dialog-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
</style>
