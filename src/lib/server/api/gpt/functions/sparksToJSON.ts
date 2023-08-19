export function returnJSON({ spark, index }: { spark: string; index: number }) {
	return { spark, index }
}

export const returnJSONDefinition = {
	name: "returnJSON",
	description: "Return JSON",
	parameters: {
		type: "object",
		properties: {
			spark: {
				type: "string",
				description: "The spark to return as a string in a JSON",
			},
			index: {
				type: "number",
				description: "The index of the spark to return as a string in a JSON",
			},
		},
		required: ["spark", "index"],
	},
}
