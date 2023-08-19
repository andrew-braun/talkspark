import { json } from "@sveltejs/kit"
import { fetchChatResponse } from "lib/server/api/gpt/chat-api.js"

export async function POST({ request, cookies }) {
	try {
		const { type, options } = await request.json()

		const response = await fetchChatResponse({
			message: "Give me a list of three random conversation starters.",
			roles: [
				{
					role: "system",
					content:
						"You will provide these conversation starters as a list of JSON objects, each with a 'content' property, like so: {'content': 'Conversation starter'}. }",
				},
			],
		})

		return json(response, { status: 201 })
	} catch (error) {
		console.error(error)

		return json({ error }, { status: 500 })
	}
}
