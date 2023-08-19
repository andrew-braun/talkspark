import initOpenAi from "lib/server/api/gpt/init"
import type { ChatCompletionRequestMessage } from "openai"
import { returnSparkJSON } from "lib/server/api/gpt/functions/sparksToJSON.js"

export async function fetchChatResponse({
	message,
	roles,
	functions = [],
}: {
	message: string
	roles?: ChatCompletionRequestMessage[]
	functions?: any[]
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
			functions: functions,
			function_call: "auto",
		})

		const parsedResponse = parseResponse(response)

		return { chatResponse: parsedResponse }
	} catch (error) {
		console.error(error)

		throw error
	}
}

function parseResponse(response: any) {
	const { choices } = response.data

	const responseObjects = choices.map((choice: any) => choice.message)

	const contentArray = responseObjects.map(
		(responseObject: any) => responseObject?.content
	)

	return contentArray
}
