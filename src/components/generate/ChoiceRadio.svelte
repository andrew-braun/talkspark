<script lang="ts">
	import Button from "components/buttons/Button.svelte"
	import type { Choice } from "ts/flow"

	export let choices: Choice[] = []

	let currentlySelectedId = choices[0].id
	$: currentlySelectedValue = choices.find(
		(choice) => choice.id === currentlySelectedId
	)?.value

	const handleRadioButtonSelect = (event: Event) => {
		console.log(event.target)
		const target = event.target as HTMLInputElement
		currentlySelectedId = target.id
	}
</script>

<div class="choices">
	{#each choices as choice}
		<div class="choice">
			<Button
				style="primary"
				onClick={handleRadioButtonSelect}
				active={choice.id === currentlySelectedId}
				id={choice.id}>{choice.text}</Button
			>
		</div>
	{/each}
</div>

<style lang="scss">
	.choices {
		.choice {
			margin: var(--spacing-xs);
			width: clamp(260px, 20vw, 300px);
		}
	}
</style>
