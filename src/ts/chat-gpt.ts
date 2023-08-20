import type { CreateChatCompletionRequestStop } from "openai"

export interface ChatCompletionResponseMessage {
	role: string
	content: string
}

export interface ChatCompletionResponseChoice {
	index: number
	message: ChatCompletionResponseMessage
	finish_reason: CreateChatCompletionRequestStop
}
