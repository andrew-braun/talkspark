<script lang="ts">
	import GenerateSparksButton from "components/buttons/GenerateSparksButton.svelte"
	import Sparks from "components/sparks/Sparks.svelte"
	import { generatedSparks } from "stores/starters/generated-sparks"
	import type { SparkData } from "ts/sparks"

	let currentSparks: SparkData[] = []
	generatedSparks.subscribe((sparks) => {
		currentSparks = sparks
	})
</script>

<h1>Sparks</h1>
<GenerateSparksButton buttonText="More Random Sparks" />
<Sparks sparks={currentSparks} />
