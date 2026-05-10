import initOpenAi from "lib/server/api/gpt/init"

const SYSTEM_INSTRUCTIONS = `You are a conversation starter app. Your goal is to engage users by generating interesting conversation openers.
You will provide conversation starters ONLY as a JSON object with a "sparks" array.
Each spark object must have only a "content" key.
Each conversation starter should be limited to 256 characters or less.
Here is the required format: { "sparks": [{ "content": "Conversation starter 1" }, { "content": "Conversation starter 2" }] }`

export async function fetchChatResponse({ message }: { message: string }) {
	const openai = initOpenAi()

	const response = await openai.responses.create({
		model: "gpt-4o-mini",
		instructions: SYSTEM_INSTRUCTIONS,
		input: message,
		text: {
			format: {
				type: "json_schema",
				name: "sparks_response",
				strict: true,
				schema: {
					type: "object",
					properties: {
						sparks: {
							type: "array",
							items: {
								type: "object",
								properties: {
									content: { type: "string" },
								},
								required: ["content"],
								additionalProperties: false,
							},
						},
					},
					required: ["sparks"],
					additionalProperties: false,
				},
			},
		},
	})

	return { chatResponse: response.output_text }
}
