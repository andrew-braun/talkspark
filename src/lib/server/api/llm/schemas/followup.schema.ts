import { CONVERSATION_SKILLS, type ConversationSkill } from 'ts/spark';

function stringEnum<T extends readonly string[]>(values: T) {
	return { type: 'string', enum: [...values] };
}

const GENERATED_FOLLOWUP_SCHEMA = {
	type: 'object',
	properties: {
		content: { type: 'string' },
		depth_delta: { type: 'integer', minimum: 1, maximum: 3 },
		skill: stringEnum(CONVERSATION_SKILLS),
	},
	required: ['content', 'depth_delta', 'skill'],
	additionalProperties: false,
} as const;

export const FOLLOWUPS_RESPONSE_SCHEMA: Record<string, unknown> = {
	type: 'object',
	properties: {
		followups: {
			type: 'array',
			items: GENERATED_FOLLOWUP_SCHEMA,
		},
	},
	required: ['followups'],
	additionalProperties: false,
};

export interface GeneratedFollowup {
	content: string;
	depth_delta: number;
	skill: ConversationSkill;
}

export interface FollowupsResponse {
	followups: GeneratedFollowup[];
}
