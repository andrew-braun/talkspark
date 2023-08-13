import { writable } from "svelte/store"

export const generatedStarters: Writable<string[]> = writable([])
