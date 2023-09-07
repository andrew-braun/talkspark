<script lang="ts">
	import { generated_sparks } from "stores/sparks/generated-sparks"
	import { loadingState } from "stores/app-state/loading"
	import { getSpark, type GetSparkResponse } from "lib/client/gpt/chat"

	import Button from "./Button.svelte"

	export let buttonText: string = "Random Sparks"
	export let onClick: () => Promise<void> = async () => {}

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

			generated_sparks.update((currentSparks) => {
				return [...currentSparks, ...sparks]
			})

			await onClick()

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
	{buttonText}
</Button>
