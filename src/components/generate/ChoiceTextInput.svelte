<script lang="ts">
	import TextInput from "components/forms/elements/TextInput.svelte"
	import { updateChoices } from "stores/sparks/customizations"
	import type { FlowInput } from "ts/flow"

	export let input: FlowInput

	const { id, text } = input

	const handleInputChange = (event: any) => {
		updateChoices({ choice: id, value: event?.target?.value ?? null })
	}
</script>

<div class="choice-text-input">
	<TextInput
		id={`${id}-other`}
		label={`${text} ✍️`}
		onInput={handleInputChange}
	/>
</div>

<style lang="scss">
	.choice-text-input {
		margin: var(--spacing-lg) 0;
	}
</style>
