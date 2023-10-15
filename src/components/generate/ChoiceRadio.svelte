<script lang="ts">
	import Button from "components/buttons/Button.svelte"
	import InputLabel from "components/forms/elements/InputLabel/InputLabel.svelte"
	import type { FlowInput } from "ts/flow"
	import type { Choice } from "ts/flow"
	import { customizations } from "stores/sparks/customizations"

	export let input: FlowInput

	const choices: Choice[] | [] = input?.choices ?? []
	const inputId = input?.id ?? ""

	let currentlySelectedId = choices[0].id
	$: currentlySelectedValue = choices.find(
		(choice) => choice.id === currentlySelectedId
	)?.value

	const handleRadioButtonSelect = (event: Event) => {
		console.log(event.target)
		customizations.update((customizations) => {
			return {
				...customizations,
				choices: {
					...customizations.choices,
					[inputId]: currentlySelectedValue,
				},
			}
		})
		const target = event.target as HTMLInputElement
		currentlySelectedId = target.id
	}

	customizations.subscribe((customizations) => {
		// console.log(customizations)
	})
</script>

<div class="choices">
	<InputLabel htmlFor={input.id} formElement={false} type="radio"
		>{input.text}</InputLabel
	>
	{#each choices as choice}
		<div class="choice">
			<Button
				style="light"
				secondaryStyle="chip"
				onClick={handleRadioButtonSelect}
				active={choice.id === currentlySelectedId}
				id={choice.id}
				classes="choice-button">{choice.text} {choice?.emoji ?? ""}</Button
			>
		</div>
	{/each}
</div>

<style lang="scss">
	.choices {
		.choice {
			margin: var(--spacing-xs);
			width: 100%;
		}
	}
</style>
