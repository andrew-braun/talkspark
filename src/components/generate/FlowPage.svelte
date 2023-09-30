<script lang="ts">
	// import Button from "components/buttons/Button.svelte"
	import type { FlowPage } from "ts/flow"
	import ChoiceRadio from "./ChoiceRadio.svelte"

	export let page: FlowPage
	console.log(page)
</script>

<div class="choices">
	{#each page?.inputs as input}
		{#if input.type === "radio"}
			<ChoiceRadio choices={input.choices} id={input.id} />
		{/if}
	{/each}
</div>

<style lang="scss">
	.choices {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
