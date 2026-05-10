<script lang="ts">
	import { generateSparks } from "$lib/generate.remote"
	import { generatedSparks } from "stores/sparks.svelte"
	import { loadingState } from "stores/loading.svelte"
	import Button from "./Button.svelte"

	let {
		buttonText = "Random Sparks",
		onClick = async () => {},
	}: {
		buttonText?: string
		onClick?: () => Promise<void>
	} = $props()

	const handleSparkGeneration = async () => {
		loadingState.isLoading = true

		try {
			const { sparks } = await generateSparks({ type: "random" })
			generatedSparks.add(sparks)
			await onClick()
		} catch (error) {
			console.error(error)
		} finally {
			loadingState.isLoading = false
		}
	}
</script>

<Button
	style="primary"
	onClick={handleSparkGeneration}
	classes="spark-button"
	disabled={loadingState.isLoading}
	isLoading={loadingState.isLoading}
	loadingText="✨ Generating sparks..."
>
	{buttonText}
</Button>
