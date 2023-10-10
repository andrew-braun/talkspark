<script lang="ts">
	import Button from "components/buttons/Button.svelte"
	import PageNavigation from "./PageNavigation.svelte"

	export let pages: any[]
	console.log(pages)
</script>

<div class="pages">
	{#each pages as page}
		<svelte:component this={page.component} props={page.props} />
	{/each}
	<PageNavigation />
</div>
