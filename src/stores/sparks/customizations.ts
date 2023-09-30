import { writable } from "svelte/store"
import type { Writable } from "svelte/store"
import type { Customizations } from "ts/flow"

export const customizations: Writable<Customizations> = writable({
	choices: [],
})
