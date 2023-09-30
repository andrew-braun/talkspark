<script lang="ts">
	import Button from "components/buttons/Button.svelte"
	import type { Choice } from "ts/flow"

	export let choices: Choice[] = []
	console.log(choices)
</script>

<div class="choices">
	{#each choices as choice}
		<div class="choice">
			<Button style="primary" onClick={() => {}}>{choice.text}</Button>
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
