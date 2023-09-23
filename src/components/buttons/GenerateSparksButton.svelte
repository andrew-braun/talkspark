<script lang="ts">
	import { generated_sparks } from "stores/sparks/generated-sparks"
	import { loadingState } from "stores/app-state/loading"
	import { getSpark, type GetSparkResponse } from "lib/client/gpt/chat"

	import Button from "./Button.svelte"
	// import Spark from "components/sparks/Spark.svelte"

	export let type: "random" | "custom" = "random"
	export let buttonText: string =
		type === "random" ? "Random Sparks" : "Custom Sparks"
	export let onClick: () => Promise<void> = async () => {}
	export let openCustomModal: () => void = () => {}
	// export let closeCustomModal: () => void = () => {}

	let generatingSparks: boolean = false
	loadingState.subscribe((loading) => {
		generatingSparks = loading
	})

	async function generateSparks() {
		try {
			const promptResponse: GetSparkResponse = await getSpark({
				type,
			})

			const { sparks } = promptResponse

			return sparks
		} catch (error) {
			console.error(error)
			loadingState.set(false)
		}
	}

	const handleSparkGeneration = async () => {
		loadingState.set(true)

		let sparks: any = []

		if (type === "random") {
			sparks = await generateSparks()

			generated_sparks.update((currentSparks) => {
				return [...currentSparks, ...sparks]
			})

			await onClick()

			return
		}

		if (type === "custom") {
			openCustomModal()
			loadingState.set(false)

			console.log("Creating custom sparks...")

			await onClick()

			return
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
