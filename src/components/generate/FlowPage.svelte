<script lang="ts">
	import type { FlowPageProps } from "ts/flow"
	import FlowInput from "./FlowInput.svelte"

	export let props: FlowPageProps

	const page = props
</script>

<div class="choices">
	{#each page?.inputs as input}
		<FlowInput {input} />
	{/each}
</div>

<style lang="scss">
	.choices {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: clamp(260px, 80%, 320px);
	}
</style>
