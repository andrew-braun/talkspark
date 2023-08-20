import type { Spark } from "ts/sparks"

export interface SparkProps {
	type: "random" | "custom"
	options?: any
}

export interface GetSparkResponse {
	sparks: Spark[]
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
