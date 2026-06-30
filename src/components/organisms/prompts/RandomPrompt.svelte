<script lang="ts">
	import { generatedSparks } from 'stores/sparks.svelte';
	import Sparks from 'components/organisms/sparks/Sparks.svelte';
	import GenerateSparksButton from 'components/organisms/sparks/GenerateSparksButton.svelte';
</script>

<div class="dialog-container">
	<GenerateSparksButton />

	<div class="sparks-container">
		<Sparks sparks={generatedSparks.items} clearButton={true} />
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
