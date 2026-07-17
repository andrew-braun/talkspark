<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import GenerateSparksButton from 'components/organisms/sparks/GenerateSparksButton.svelte';
	import Sparks from 'components/organisms/sparks/Sparks.svelte';
	import { savedSparks } from 'stores/sparks.svelte';

	// This page has no generation stage, so failures need their own visible feedback.
	let errorMessage = $state('');
</script>

<h1>Sparks</h1>
<div class="button-container">
	<GenerateSparksButton
		buttonText="More Random Sparks"
		onGenerateStart={() => (errorMessage = '')}
		onGenerated={async () => {
			errorMessage = '';
			if (page.data.pathname !== '/') await goto(resolve('/'));
		}}
		onGenerateError={() => (errorMessage = 'Could not make sparks. Please try again.')}
	/>
	{#if errorMessage}
		<p class="generation-error" role="alert">{errorMessage}</p>
	{/if}
</div>
<Sparks sparks={savedSparks.items} sparkStore={savedSparks} />

<style lang="scss">
	.button-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
		margin: var(--spacing-xl) 0;

		.generation-error {
			margin: 0;
			padding: var(--spacing-sm) var(--spacing-md);
			border: 1px solid var(--accent-color-2);
			border-radius: var(--border-radius-md);
			color: var(--text-color-light);
			font-size: var(--font-size-md);
			text-align: center;
		}
	}
</style>
