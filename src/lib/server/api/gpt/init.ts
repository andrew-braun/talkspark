import { Configuration, OpenAIApi } from "openai"
import { OPENAI_API_KEY } from "$env/static/private"

export default function initOpenAi() {
	const configuration = new Configuration({
		// organization: "org-0nmrFWw6wSm6xIJXSbx4FpTw",
		apiKey: OPENAI_API_KEY,
	})

	const client = new OpenAIApi(configuration)

	return client
}
