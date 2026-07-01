export const CRITIQUE_RESPONSE_SCHEMA: Record<string, unknown> = {
	type: 'object',
	properties: {
		clarity: { type: 'integer', minimum: 1, maximum: 5 },
		answerability: { type: 'integer', minimum: 1, maximum: 5 },
		context_fit: { type: 'integer', minimum: 1, maximum: 5 },
		safety: { type: 'integer', minimum: 1, maximum: 5 },
		flags: {
			type: 'array',
			items: { type: 'string' },
		},
		suggested_rewrite: { type: 'string' },
	},
	required: ['clarity', 'answerability', 'context_fit', 'safety', 'flags', 'suggested_rewrite'],
	additionalProperties: false,
};

export interface GeneratedCritique {
	clarity: number;
	answerability: number;
	context_fit: number;
	safety: number;
	flags: string[];
	suggested_rewrite: string;
}
