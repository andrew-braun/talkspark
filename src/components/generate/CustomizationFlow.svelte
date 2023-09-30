<script lang="ts">
	import type { FlowInput } from "ts/flow"
	import FlowPage from "components/generate/FlowPage.svelte"

	const page1Inputs: FlowInput[] = [
		{
			id: "relationship-type",
			type: "radio",
			text: "Type of relationship",
			choices: [
				{
					id: "relationship-type-romantic",
					text: "Romantic",
					value: "romantic",
				},
				{
					id: "relationship-type-professional",
					text: "Professional",
					value: "professional",
				},
				{
					id: "relationship-type-friend",
					text: "Friend",
					value: "friend",
				},
				{
					id: "relationship-type-family",
					text: "Family",
					value: "family",
				},
				{
					id: "relationship-type-acquaintance",
					text: "Acquaintance",
					value: "acquaintance",
				},
			],
		},
	]

	const pages = [
		{
			id: "page-1",
			inputs: page1Inputs,
		},
	]
</script>

<div class="customization-flow">
	{#each pages as page}
		<FlowPage {page} />
	{/each}
</div>

<style lang="scss">
	.customization-flow {
		color: var(--text-color-light);
	}
</style>
