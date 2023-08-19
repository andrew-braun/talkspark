import { json } from "@sveltejs/kit"
import { fetchChatResponse } from "lib/server/api/gpt/chat-api.js"

export async function POST({ request, cookies }) {
	try {
		const { type, options } = await request.json()

		const response = await fetchChatResponse({
			message: "Give me a list of three random conversation starters.",
		})

		return json(response, { status: 201 })
	} catch (error) {
		console.error(error)

		return json({ error }, { status: 500 })
	}
}
