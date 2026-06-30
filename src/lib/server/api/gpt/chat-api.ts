import { getProvider } from 'lib/server/api/llm';

const SYSTEM_INSTRUCTIONS = `You are a conversation starter app. Your goal is to engage users by generating interesting conversation openers.
You will provide conversation starters ONLY as a JSON object with a "sparks" array.
Each spark object must have only a "content" key.
Each conversation starter should be limited to 256 characters or less.
Here is the required format: { "sparks": [{ "content": "Conversation starter 1" }, { "content": "Conversation starter 2" }] }`;

const SPARKS_SCHEMA: Record<string, unknown> = {
	type: 'object',
	properties: {
		sparks: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					content: { type: 'string' },
				},
				required: ['content'],
				additionalProperties: false,
			},
		},
	},
	required: ['sparks'],
	additionalProperties: false,
};

export async function fetchChatResponse({ message }: { message: string }) {
	const provider = getProvider();
	const result = await provider.generateStructured<{ sparks: { content: string }[] }>({
		system: SYSTEM_INSTRUCTIONS,
		prompt: message,
		schema: SPARKS_SCHEMA,
		schemaName: 'sparks_response',
	});
	// Stringify so generate.remote.ts can JSON.parse it unchanged (will be replaced in T3)
	return { chatResponse: JSON.stringify(result) };
}
