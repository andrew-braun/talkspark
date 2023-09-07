import type { SparkData } from "ts/sparks"

export interface SparkProps {
	type: "random" | "custom"
	options?: any
}

export interface GetSparkResponse {
	sparks: SparkData[]
	status: number
}

export async function getSpark({ type, options }: SparkProps) {
	const response = await fetch("/api/generate", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ type, options }),
	})

	const data: GetSparkResponse = await response.json()

	return data
}
