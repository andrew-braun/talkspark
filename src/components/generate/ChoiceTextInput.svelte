<script lang="ts">
	import TextInput from "components/forms/elements/TextInput.svelte"
	import type { FlowInput } from "ts/flow"

	export let input: FlowInput

	const { id, text } = input
</script>

<div class="choice-text-input">
	<TextInput {id} label={`${text} ✍️`} />
</div>

<style lang="scss">
	.choice-text-input {
		margin: var(--spacing-lg) 0;
	}
</style>
