<script lang="ts">
	import Button from "components/buttons/Button.svelte"
	import { generatedSparks } from "stores/starters/generated-sparks"
	import { loadingState } from "stores/app-state/loading"
	import { getSpark, type GetSparkResponse } from "lib/client/gpt/chat"
	import Sparks from "components/sparks/Sparks.svelte"

	import type { SparkData } from "ts/sparks"

	let currentSparks: SparkData[] = []
	generatedSparks.subscribe((sparks) => {
		currentSparks = sparks
	})

	let generatingSparks: boolean = false
	loadingState.subscribe((loading) => {
		generatingSparks = loading
	})

	const handleRandomSparkInitiate = async () => {
		loadingState.set(true)

		try {
			const promptResponse: GetSparkResponse = await getSpark({
				type: "random",
			})

			const { sparks } = promptResponse

			generatedSparks.update((currentSparks) => {
				return [...currentSparks, ...sparks]
			})

			loadingState.set(false)
		} catch (error) {
			console.error(error)
			loadingState.set(false)
		}
	}
</script>

<div class="dialog-container">
	<Button
		style="primary"
		onClick={handleRandomSparkInitiate}
		classes="random-spark-button"
		disabled={generatingSparks}
		isLoading={generatingSparks}
		loadingText="✨ Generating sparks..."
	>
		Random Sparks
	</Button>

	<div class="sparks-container">
		<Sparks sparks={currentSparks} />
	</div>
</div>

<style lang="scss">
	.dialog-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;

		.sparks-container {
			margin-top: var(--spacing-lg);
		}
	}
</style>
