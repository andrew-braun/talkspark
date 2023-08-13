import { writable } from "svelte/store"
import type { Writable } from "svelte/store"
import type { ConversationStarter } from "ts/conversation-starters"

export const generatedStarters: Writable<ConversationStarter[]> = writable([])
