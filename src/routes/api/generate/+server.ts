import crypto from "crypto"
import { json } from "@sveltejs/kit"
import { fetchChatResponse } from "lib/server/api/gpt/chat-api.js"
import { topics } from "lib/data/random-topics.js"
import type { SparkData } from "ts/sparks.js"

export async function POST({ request }) {
	try {
		const body = await request.json()
		const { type } = body

		function pickRandomTopicSeed() {
			const randomTopicSeed = Math.floor(Math.random() * topics.length)
			return randomTopicSeed
		}

		// Ensure that chatResponse returns a JSON-serialized array of sparks
		const { chatResponse } = await fetchChatResponse({
			message: `Give me a list of three random conversation starters, structured as a JSON object. Try to create conversations loosely based on the topic of ${
				topics[pickRandomTopicSeed()]
			}, but do not make all the questions center on this single topic. 
			One question should be about the topic, 
			the second question should be about the opposite of the topic, 
			and the third question should be funny or weird, something people 
			normally wouldn't connect with this idea.`,
			roles: [
				{
					role: "system",
					content: `You are a conversation starter app. Your goal is to engage users by generating interesting conversation openers. Return only JSON objects with a "content" key. Each conversation starter should be limited to 256 characters or less.`,
				},
				{
					role: "system",
					content: `You will provide these conversation starters ONLY as an 
						array of JSON objects, each with a 'content' key, like so: {"content": "Conversation starter"}
					 `,
				},
				{
					role: "system",
					content: `Here is an example response format: [ {"content": "Conversation starter 1"}, {"content": "Conversation starter 2"}, {"content": "Conversation starter 3"}	]
					 `,
				},
				{
					role: "system",
					content: `Only provide the array. Do not wrap it in an object. Do not include any other keys. The response should ONLY be in the structure: [ { content: "Conversation starter 1"} ]`,
				},
			],
		})

		/* Currently, we simply get a string that we can convert to JSON, returned
		 ** as a single response from ChatGPT. Ideally, we want to use a function to
		 ** force ChatGPT to format the response itself, but that's a ToDo item.
		 */

		const sparkJSON: SparkData[] = JSON.parse(chatResponse[0])

		const sparksArray = sparkJSON.map((spark, index) => {
			return { ...spark, index, type, id: crypto.randomUUID() }
		})

		return json({ sparks: sparksArray, status: 201 })
	} catch (error) {
		console.error(error)

		return json({ error: true, message: JSON.stringify(error), status: 500 })
	}
}
