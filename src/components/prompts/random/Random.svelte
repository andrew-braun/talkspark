<script lang="ts">
	import Button from "components/buttons/Button.svelte"

	import { getConversationStarter } from "lib/client/gpt/chat"

	const handleRandomConversationInitiate = async () => {
		const promptResponse = await getConversationStarter({
			type: "random",
		})
		console.log(promptResponse)
	}
</script>

<Button style="primary" onClick={handleRandomConversationInitiate}
	>Random Conversation</Button
>
