<script lang="ts">
	import Button from "$components/buttons/Button.svelte"
	import InputLabel from "$components/forms/elements/InputLabel/InputLabel.svelte"
	import type { FlowInput } from "$ts/flow"
	import type { Choice } from "$ts/flow"
	import { customizations, updateChoices } from "$stores/sparks/customizations"

	export let input: FlowInput

	const props = input?.props ?? {}
	const style: "default" | "chips" = props?.style ?? "default"

	const choices: Choice[] | [] = input?.choices ?? []
	const inputId = input?.id ?? ""

	let currentlySelectedIds: string[] = []
	$: currentlySelectedValues =
		choices
			.filter((choice) => currentlySelectedIds.includes(choice.id))
			?.map((choice) => choice?.value) ?? []

	$: isSelected = (id: string): boolean => {
		return currentlySelectedIds.includes(id)
	}

	const handleCheckboxButtonSelect = (event: Event) => {
		updateChoices({ choice: inputId, value: currentlySelectedValues })
		const target = event.target as HTMLInputElement
		const targetId = target.id

		if (currentlySelectedIds.includes(targetId)) {
			currentlySelectedIds = currentlySelectedIds.filter(
				(id) => id !== targetId
			)
		} else {
			currentlySelectedIds = [...currentlySelectedIds, targetId]
		}
	}

	customizations.subscribe((customizations) => {
		// console.log(customizations)
	})
</script>

<div class="choices">
	<InputLabel htmlFor={input.id} formElement={false} type="checkboxes"
		>{input.text}</InputLabel
	>

	{#each choices as choice}
		<div class="choice">
			<!-- {#key currentlySelectedValues} -->
			<Button
				style="light"
				secondaryStyle="chip"
				onClick={handleCheckboxButtonSelect}
				active={isSelected(choice.id)}
				id={choice.id}
				classes="choice-button">{choice.text} {choice?.emoji ?? ""}</Button
			>
			<!-- {/key} -->
		</div>
	{/each}
</div>

<style lang="scss">
	.choices {
		position: relative;
		height: 100%;
		overflow: auto;
		.choice {
			margin: var(--spacing-xs) 0;
			width: 100%;
		}
	}
</style>
