export interface SparkProps {
	type: string
	options?: any
}

export async function getSpark({ type, options }: SparkProps) {
	const response = await fetch("/api/generate", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ type, options }),
	})

	const data = await response.json()

	return data
}
