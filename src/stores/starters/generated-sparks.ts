import { writable } from "svelte/store"
import type { Writable } from "svelte/store"
import type { SparkData } from "ts/sparks"

export const generatedSparks: Writable<SparkData[]> = writable([])
