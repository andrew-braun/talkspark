<script lang="ts">
	import Button from "components/buttons/Button.svelte"
	import { generatedStarters } from "stores/starters/generated-sparks"
	import { getSpark } from "lib/client/gpt/chat"

	import type { Spark } from "ts/sparks"

	let currentStarters: Spark[] = []

	generatedStarters.subscribe((starters) => {
		currentStarters = starters
	})

	const handleRandomSparkInitiate = async () => {
		const promptResponse = await getSpark({
			type: "random",
		})

		const formattedStarters = promptResponse.chatResponse.map(
			(starter: any) => {
				return {
					type: "random",
					text: starter,
				}
			}
		)

		generatedStarters.update((starters) => {
			return [...starters, ...formattedStarters]
		})
	}
</script>

<Button style="primary" onClick={handleRandomSparkInitiate}>Random Spark</Button
>

<div class="response-container">
	{#each currentStarters as starter}
		<div class="response">{starter.text}</div>
	{/each}
</div>
