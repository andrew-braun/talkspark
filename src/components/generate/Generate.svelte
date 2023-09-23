<script lang="ts">
	import { generated_sparks } from "stores/sparks/generated-sparks"
	import Sparks from "components/sparks/Sparks.svelte"

	import type { SparkData } from "ts/sparks"
	import GenerateSparksButton from "components/buttons/GenerateSparksButton.svelte"
	import CustomModal from "./CustomModal.svelte"

	let currentSparks: SparkData[] = []
	generated_sparks.subscribe((sparks) => {
		currentSparks = sparks
	})

	let isCustomModalOpen = false

	function openCustomModal() {
		isCustomModalOpen = true
	}

	function closeCustomModal() {
		isCustomModalOpen = false
	}
</script>

<div class="dialog-container">
	<div class="generate-buttons">
		<span class="generate-button">
			<GenerateSparksButton type="random" />
		</span>
		<span class="generate-button">
			<GenerateSparksButton type="custom" {openCustomModal} />
		</span>
	</div>

	<div class="sparks-container">
		<Sparks sparks={currentSparks} clearButton={true} />
	</div>
	<div class="custom-modal">
		<CustomModal open={isCustomModalOpen} {closeCustomModal} />
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

		.generate-buttons {
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			width: 100%;

			.generate-button {
				min-width: 200px;
				max-width: 280px;
				width: 50%;
				margin: var(--spacing-md);

				@media (max-width: 480px) {
					width: 100%;
				}
			}
		}

		.sparks-container {
			flex: 1 1 auto;
			width: 100%;
			margin-top: var(--spacing-lg);
		}
	}
</style>
