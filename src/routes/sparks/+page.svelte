<script lang="ts">
	import { page } from "$app/stores"
	import { goto } from "$app/navigation"
	import GenerateSparksButton from "components/buttons/GenerateSparksButton.svelte"
	import Sparks from "components/sparks/Sparks.svelte"
	import { saved_sparks } from "stores/sparks/saved-sparks"
	import type { SparkData } from "ts/sparks"

	let savedSparks: SparkData[] = []
	saved_sparks.subscribe((sparks) => {
		savedSparks = sparks
	})

	async function handleGenerateSparksClick() {
		if ($page.data.pathname !== "/") {
			await goto("/")
		}
	}
</script>

<h1>Sparks</h1>
<div class="button-container">
	<GenerateSparksButton
		buttonText="More Random Sparks"
		onClick={handleGenerateSparksClick}
	/>
</div>
<Sparks sparks={savedSparks} sparkStore={saved_sparks} />

<style lang="scss">
	.button-container {
		display: flex;
		justify-content: center;
		margin: var(--spacing-xl) 0;
	}
</style>
