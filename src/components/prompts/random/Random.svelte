<script lang="ts">
	import Button from "components/buttons/Button.svelte"
	import { generatedStarters } from "stores/starters/generated-starters"
	import { getConversationStarter } from "lib/client/gpt/chat"

	import type { ConversationStarter } from "ts/conversation-starters"

	let currentStarters: ConversationStarter[] = []

	generatedStarters.subscribe((starters) => {
		currentStarters = starters
	})

	const handleRandomConversationInitiate = async () => {
		const promptResponse = await getConversationStarter({
			type: "random",
		})

		const formattedStarters = promptResponse.conversationStarters.map(
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

<Button style="primary" onClick={handleRandomConversationInitiate}
	>Random Conversation</Button
>

<div class="response-container">
	{#each currentStarters as starter}
		<div class="response">{starter.text}</div>
	{/each}
</div>
