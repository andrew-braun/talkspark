import type OpenAI from "openai"
// import type { CreateChatCompletionRequestStop } from "openai"

// interface CreateChatCompletionRequestStop extends OpenAI.Chat.Completions.CompletionCreateParams.

export interface ChatCompletionResponseMessage {
	role: string
	content: string
}

export interface ChatCompletionResponseChoice {
	index: number
	message: ChatCompletionResponseMessage
	finish_reason: string
}
