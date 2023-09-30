<script lang="ts">
	import type { FlowInput } from "ts/flow"
	import ChoiceRadio from "./ChoiceRadio.svelte"

	export let input: FlowInput
</script>

{#if input.type === "radio"}
	<ChoiceRadio choices={input.choices} id={input.id} />
{/if}
