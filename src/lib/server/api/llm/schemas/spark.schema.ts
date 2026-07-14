import {
	ANSWER_SHAPES,
	CONVERSATION_MOTIVES,
	CONVERSATION_SKILLS,
	RECIPROCITY_MODES,
	SPARK_VARIANTS,
	type AnswerShape,
	type ConversationMotive,
	type ConversationSkill,
	type ReciprocityMode,
	type SparkVariant,
} from 'ts/spark';

function stringEnum<T extends readonly string[]>(values: T) {
	return { type: 'string', enum: [...values] };
}

const GENERATED_SPARK_SCHEMA = {
	type: 'object',
	properties: {
		content: { type: 'string' },
		spark_variant: stringEnum(SPARK_VARIANTS),
		conversation_motive: stringEnum(CONVERSATION_MOTIVES),
		depth_level: { type: 'integer', minimum: 1, maximum: 5 },
		controversy_level: { type: 'integer', minimum: 0, maximum: 5 },
		humor_level: { type: 'integer', minimum: 0, maximum: 5 },
		answer_shape: stringEnum(ANSWER_SHAPES),
		reciprocity_mode: stringEnum(RECIPROCITY_MODES),
		follow_up_potential: { type: 'integer', minimum: 1, maximum: 5 },
		conversation_skill: stringEnum(CONVERSATION_SKILLS),
		seed_follow_up: { type: 'string' },
	},
	required: [
		'content',
		'spark_variant',
		'conversation_motive',
		'depth_level',
		'controversy_level',
		'humor_level',
		'answer_shape',
		'reciprocity_mode',
		'follow_up_potential',
		'conversation_skill',
		'seed_follow_up',
	],
	additionalProperties: false,
} as const;

export const SPARKS_RESPONSE_SCHEMA: Record<string, unknown> = {
	type: 'object',
	properties: {
		sparks: {
			type: 'array',
			items: GENERATED_SPARK_SCHEMA,
		},
	},
	required: ['sparks'],
	additionalProperties: false,
};

export interface GeneratedSpark {
	content: string;
	spark_variant: SparkVariant;
	conversation_motive: ConversationMotive;
	depth_level: number;
	controversy_level: number;
	humor_level: number;
	answer_shape: AnswerShape;
	reciprocity_mode: ReciprocityMode;
	follow_up_potential: number;
	conversation_skill: ConversationSkill;
	seed_follow_up: string;
}

export interface SparksResponse {
	sparks: GeneratedSpark[];
}
