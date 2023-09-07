<script lang="ts">
	import { generated_sparks } from "stores/sparks/generated-sparks"
	import Sparks from "components/sparks/Sparks.svelte"

	import type { SparkData } from "ts/sparks"
	import GenerateSparksButton from "components/buttons/GenerateSparksButton.svelte"

	let currentSparks: SparkData[] = []
	generated_sparks.subscribe((sparks) => {
		currentSparks = sparks
	})
</script>

<div class="dialog-container">
	<GenerateSparksButton />

	<div class="sparks-container">
		<Sparks sparks={currentSparks} clearButton={true} />
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
			flex: 1 1 auto;
			width: 100%;
			margin-top: var(--spacing-lg);
		}
	}
</style>
