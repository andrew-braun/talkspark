export interface ConversationStarterProps {
	type: string
	options?: any
}

export async function getConversationStarter({
	type,
	options,
}: ConversationStarterProps) {
	const response = await fetch("/api/generate", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ type, options }),
	})

	const data = await response.json()

	return data
}
