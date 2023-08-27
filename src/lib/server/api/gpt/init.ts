import OpenAI from "openai"
import { OPENAI_API_KEY } from "$env/static/private"

export default function initOpenAi() {
	const client = new OpenAI({
		apiKey: OPENAI_API_KEY,
	})

	return client
}
