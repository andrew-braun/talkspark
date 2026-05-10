import { command } from "$app/server"
import * as v from "valibot"
import { fetchChatResponse } from "$lib/server/api/gpt/chat-api"
import { topics } from "$lib/data/random-topics"
import type { SparkData } from "ts/sparks"

export const generateSparks = command(
	v.object({ type: v.string() }),
	async ({ type }) => {
		const randomTopic = topics[Math.floor(Math.random() * topics.length)]

		const { chatResponse } = await fetchChatResponse({
			message: `Give me a list of three random conversation starters. Try to create conversations loosely based on the topic of ${randomTopic}, but do not make all the questions center on this single topic.
			One question should be about the topic,
			the second question should be about the opposite of the topic,
			and the third question should be funny or weird, something people normally wouldn't connect with this idea.`,
		})

		const { sparks: sparkJSON }: { sparks: Pick<SparkData, "content">[] } =
			JSON.parse(chatResponse)

		const sparks: SparkData[] = sparkJSON.map((spark, index) => ({
			...spark,
			index,
			type,
			id: globalThis.crypto.randomUUID(),
			created_at: Date.now(),
		}))

		return { sparks }
	}
)
