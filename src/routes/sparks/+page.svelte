<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import GenerateSparksButton from 'components/organisms/sparks/GenerateSparksButton.svelte';
	import Sparks from 'components/organisms/sparks/Sparks.svelte';
	import { savedSparks } from 'stores/sparks.svelte';
</script>

<h1>Sparks</h1>
<div class="button-container">
	<GenerateSparksButton
		buttonText="More Random Sparks"
		onClick={async () => {
			if (page.data.pathname !== '/') {
				await goto(resolve('/'));
			}
		}}
	/>
</div>
<Sparks sparks={savedSparks.items} sparkStore={savedSparks} />

<style lang="scss">
	.button-container {
		display: flex;
		justify-content: center;
		margin: var(--spacing-xl) 0;
	}
</style>
