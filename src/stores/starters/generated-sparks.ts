import { writable } from "svelte/store"
import type { Writable } from "svelte/store"
import type { Spark } from "ts/sparks"

export const generatedSparks: Writable<Spark[]> = writable([])
