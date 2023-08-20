import initOpenAi from "lib/server/api/gpt/init"
import type { ChatCompletionRequestMessage } from "openai"
import type { ChatCompletionResponseChoice } from "ts/chat-gpt"

export async function fetchChatResponse({
	message,
	roles,
}: {
	message: string
	roles?: ChatCompletionRequestMessage[]
}) {
	// Set default roles assuming that the user is asking for conversation starters
	const defaultRoles: ChatCompletionRequestMessage[] = [
		{
			role: "system",
			content:
				"You are a conversation starter app. Your goal is to engage users by generating interesting conversation openers.",
		},
	]

	// If default is overridden, use the provided roles
	let apiRoles: ChatCompletionRequestMessage[] = roles ?? defaultRoles

	if (!roles) {
		apiRoles = defaultRoles
	}

	try {
		const openai = initOpenAi()

		const response = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [...apiRoles, { role: "user", content: message ?? "" }],
			max_tokens: 256,
			temperature: 1.5,
			frequency_penalty: 0.75,
			presence_penalty: 1.0,
		})

		const parsedResponse = parseResponse(response)

		console.log(`Results from calling ChatGPT API: ${parsedResponse}`)

		return { chatResponse: parsedResponse }
	} catch (error) {
		console.error(error)

		throw error
	}
}

function parseResponse(response: any) {
	const { choices } = response.data

	console.log(choices)

	const responseObjects: ChatCompletionResponseChoice[] = choices.map(
		(choice: any) => choice.message
	)

	const contentArray: string[] = responseObjects.map(
		(responseObject: any) => responseObject?.content
	)

	return contentArray
}
