/* A function that simply returns what is passed to it--simply a placeholder
    in order to force ChatGPT to generate the correct JSON fields */
export function returnSparkJSON({ chatResponse }: { chatResponse: any }) {
	console.log(chatResponse)
	return chatResponse
}

const sparkSchema = {
	type: "object",
	properties: {
		sparks: {
			type: "array",
			description:
				"An array of JSON objects representing sparks, which are questions that help people start conversations.",
			items: {
				index: {
					type: "number",
					description: "The index of the spark in the array.",
				},
				content: {
					type: "string",
					description: "The content of the spark.",
				},
			},
		},
		required: ["index", "content"],
	},
}

// A function that ensures that the response follows the schema
export const sparkSchemaFunction = {
	name: "returnSparkJSON",
	description:
		"Ensure that only JSON objects following the schema are returned.",
	parameters: sparkSchema,
}
