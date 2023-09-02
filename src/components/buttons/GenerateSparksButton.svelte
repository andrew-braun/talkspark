<script lang="ts">
	import { generatedSparks } from "stores/starters/generated-sparks"
	import { loadingState } from "stores/app-state/loading"
	import { getSpark, type GetSparkResponse } from "lib/client/gpt/chat"

	import Button from "./Button.svelte"

	let generatingSparks: boolean = false
	loadingState.subscribe((loading) => {
		generatingSparks = loading
	})

	const handleSparkGeneration = async () => {
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

<Button
	style="primary"
	onClick={handleSparkGeneration}
	classes="spark-button"
	disabled={generatingSparks}
	isLoading={generatingSparks}
	loadingText="✨ Generating sparks..."
>
	Random Sparks
</Button>
