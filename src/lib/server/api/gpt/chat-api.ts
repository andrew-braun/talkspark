import initOpenAi from "lib/server/api/gpt/init"

export async function fetchChatResponse({ message }: { message: string }) {
	try {
		const openai = initOpenAi()

		const response = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [
				{ role: "user", content: "Give me a random conversation starter." },
			],
		})

		const { choices } = response.data

		const conversationStarters = choices.map((choice) => choice.message)

		return { conversationStarters }
	} catch (error) {
		console.error(error)

		throw error
	}
}
