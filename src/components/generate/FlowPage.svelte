<script lang="ts">
	import type { FlowPage } from "ts/flow"
	import FlowInput from "./FlowInput.svelte"

	export let page: FlowPage
	console.log(page)
</script>

<div class="choices">
	{#each page?.inputs as input}
		<FlowInput {input} />
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
