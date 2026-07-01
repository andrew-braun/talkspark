import { SPARK_VARIANTS, type SparkVariant } from 'ts/spark';

function stringEnum<T extends readonly string[]>(values: T) {
	return { type: 'string', enum: [...values] };
}

const CRITIQUE_GATE_PROPERTIES = {
	clarity: { type: 'integer', minimum: 1, maximum: 5 },
	answerability: { type: 'integer', minimum: 1, maximum: 5 },
	context_fit: { type: 'integer', minimum: 1, maximum: 5 },
	safety: { type: 'integer', minimum: 1, maximum: 5 },
	flags: {
		type: 'array',
		items: { type: 'string' },
	},
	suggested_rewrite: { type: 'string' },
} as const;

const CRITIQUE_GATE_REQUIRED = [
	'clarity',
	'answerability',
	'context_fit',
	'safety',
	'flags',
	'suggested_rewrite',
] as const;

export const CRITIQUE_RESPONSE_SCHEMA: Record<string, unknown> = {
	type: 'object',
	properties: CRITIQUE_GATE_PROPERTIES,
	required: [...CRITIQUE_GATE_REQUIRED],
	additionalProperties: false,
};

const BATCH_CRITIQUE_ITEM_SCHEMA = {
	type: 'object',
	properties: {
		spark_variant: stringEnum(SPARK_VARIANTS),
		...CRITIQUE_GATE_PROPERTIES,
	},
	required: ['spark_variant', ...CRITIQUE_GATE_REQUIRED],
	additionalProperties: false,
} as const;

export const BATCH_CRITIQUE_RESPONSE_SCHEMA: Record<string, unknown> = {
	type: 'object',
	properties: {
		critiques: {
			type: 'array',
			items: BATCH_CRITIQUE_ITEM_SCHEMA,
		},
	},
	required: ['critiques'],
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

export interface GeneratedBatchCritiqueItem extends GeneratedCritique {
	spark_variant: SparkVariant;
}

export interface GeneratedBatchCritiqueResponse {
	critiques: GeneratedBatchCritiqueItem[];
}
