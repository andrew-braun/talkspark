<script lang="ts">
	import GenerateSparksButton from "components/buttons/GenerateSparksButton.svelte"
	import Sparks from "components/sparks/Sparks.svelte"
	import { saved_sparks } from "stores/sparks/saved-sparks"
	import type { SparkData } from "ts/sparks"

	let savedSparks: SparkData[] = []
	saved_sparks.subscribe((sparks) => {
		savedSparks = sparks
	})
</script>

<h1>Sparks</h1>
<div class="button-container">
	<GenerateSparksButton buttonText="More Random Sparks" />
</div>
<Sparks sparks={savedSparks} />

<style lang="scss">
	.button-container {
		display: flex;
		justify-content: center;
		margin: var(--spacing-xl) 0;
	}
</style>
