<script lang="ts">
	import ChoiceRadio from "./ChoiceRadio.svelte"
	import ChoiceTextInput from "./ChoiceTextInput.svelte"
	import type { FlowInput } from "ts/flow"

	export let input: FlowInput
</script>

<div class="input-container">
	{#if input.type === "radio"}
		<ChoiceRadio {input} />
	{/if}
	{#if input.type === "text"}
		<ChoiceTextInput {input} />
	{/if}
</div>

<style lang="scss">
	.input-container {
		width: 100%;
	}
</style>
