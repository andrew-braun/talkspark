<script lang="ts">
	import type { FlowInput } from "ts/flow"
	import ChoiceRadio from "./ChoiceRadio.svelte"

	export let input: FlowInput
</script>

<div class="input-container">
	{#if input.type === "radio"}
		<ChoiceRadio {input} />
	{/if}
</div>

<style lang="scss">
	.input-container {
		width: 100%;
	}
</style>
