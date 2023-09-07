import { writable } from "svelte/store"
import { toLocalStorage, fromLocalStorage } from "stores/utils/local-storage"
import type { Writable } from "svelte/store"
import type { SparkData } from "ts/sparks"

export const generated_sparks: Writable<SparkData[]> = writable(
	fromLocalStorage("all_sparks", [])
)

toLocalStorage(generated_sparks, "all_sparks")
