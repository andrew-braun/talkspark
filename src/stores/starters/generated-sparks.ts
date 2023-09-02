import { writable } from "svelte/store"
import { toLocalStorage, fromLocalStorage } from "stores/utils/local-storage"
import type { Writable } from "svelte/store"
import type { SparkData } from "ts/sparks"

export const generatedSparks: Writable<SparkData[]> = writable(
	fromLocalStorage("saved_sparks", [])
)

toLocalStorage(generatedSparks, "saved_sparks")
