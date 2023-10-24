<script lang="ts">
	import { generated_sparks } from "stores/sparks/generated-sparks"
	import {
		loadingState,
		setLoadingState,
		type LoadingStore,
	} from "stores/app-state/loading"
	import { getSpark, type GetSparkResponse } from "lib/client/gpt/chat"

	import Button from "./Button.svelte"
	// import Spark from "components/sparks/Spark.svelte"

	export let type: "random" | "custom" = "random"
	export let buttonText: string =
		type === "random" ? "Random Sparks" : "Custom Sparks"
	export let onClick: () => Promise<void> = async () => {}
	export let openCustomModal: () => void = () => {}
	// export let closeCustomModal: () => void = () => {}

	let isSparkLoading = false

	loadingState.subscribe((loading) => {
		isSparkLoading = loading[`${type}Sparks`]?.loading
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
			setLoadingState({ action: "randomSparks", loading: false })
		}
	}

	const handleSparkGeneration = async () => {
		let sparks: any = []

		if (type === "random") {
			setLoadingState({ action: "randomSparks", loading: true })
			sparks = await generateSparks()

			generated_sparks.update((currentSparks) => {
				return [...currentSparks, ...sparks]
			})

			await onClick()

			setLoadingState({ action: "randomSparks", loading: false })
			return
		}

		if (type === "custom") {
			openCustomModal()

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
	disabled={isSparkLoading}
	isLoading={isSparkLoading}
	loadingText="✨ Generating sparks..."
>
	{buttonText}
</Button>
