import { writable } from "svelte/store"
import type { Writable } from "svelte/store"

export const loadingState: Writable<boolean> = writable(false)
