import type { CritiqueResult } from './critique';

// Categorical union types — match the taxonomy in docs/philosophy/spark-taxonomy.md

export type RelationshipContext =
	'first_date' | 'partner' | 'family' | 'close_friend' | 'coworker' | 'team' | 'stranger';

export type TopicLens =
	| 'everyday_life'
	| 'stories_memories'
	| 'interests_culture'
	| 'hopes_plans'
	| 'ideas_perspectives'
	| 'imagination_hypotheticals';

export type Setting = 'dinner' | 'road_trip' | 'meeting' | 'classroom' | 'party' | 'online_chat';

export type ConversationGoal =
	'break_ice' | 'reconnect' | 'laugh' | 'reflect' | 'repair' | 'debate' | 'brainstorm';

export type ConversationMotive =
	'learn' | 'affiliate' | 'coordinate' | 'persuade' | 'play' | 'support';

export type Vibe = 'playful' | 'warm' | 'thoughtful' | 'weird' | 'romantic' | 'nostalgic';

export type AnswerShape =
	'story' | 'memory' | 'ranking' | 'tradeoff' | 'recommendation' | 'prediction';

export type ReciprocityMode =
	'one_person' | 'everyone_answers' | 'answer_then_ask' | 'pass_the_question';

export type VulnerabilityRamp = 'steady' | 'escalating' | 'capped' | 'random_within_bounds';

export type ConversationSkill =
	'follow_up' | 'listen' | 'callback' | 'perspective_get' | 'common_ground' | 'repair';

export type SourceType =
	'ai_generated' | 'human_written' | 'imported' | 'user_submitted' | 'remixed';

export type Status =
	'draft' | 'candidate' | 'needs_revision' | 'approved' | 'featured' | 'retired' | 'rejected';

export type Visibility = 'public' | 'private' | 'unlisted';

// Generation-time variant for the three-spark structure (primary / contrast / playful-weird).
export const SPARK_VARIANTS = ['primary', 'contrast', 'playful_weird'] as const;
export type SparkVariant = (typeof SPARK_VARIANTS)[number];

// Const arrays shared by Valibot input validation and LLM JSON Schema enums.
export const RELATIONSHIP_CONTEXTS = [
	'first_date',
	'partner',
	'family',
	'close_friend',
	'coworker',
	'team',
	'stranger',
] as const satisfies readonly RelationshipContext[];

export const TOPIC_LENSES = [
	'everyday_life',
	'stories_memories',
	'interests_culture',
	'hopes_plans',
	'ideas_perspectives',
	'imagination_hypotheticals',
] as const satisfies readonly TopicLens[];

export const SETTINGS = [
	'dinner',
	'road_trip',
	'meeting',
	'classroom',
	'party',
	'online_chat',
] as const satisfies readonly Setting[];

export const CONVERSATION_GOALS = [
	'break_ice',
	'reconnect',
	'laugh',
	'reflect',
	'repair',
	'debate',
	'brainstorm',
] as const satisfies readonly ConversationGoal[];

export const CONVERSATION_MOTIVES = [
	'learn',
	'affiliate',
	'coordinate',
	'persuade',
	'play',
	'support',
] as const satisfies readonly ConversationMotive[];

export const VIBES = [
	'playful',
	'warm',
	'thoughtful',
	'weird',
	'romantic',
	'nostalgic',
] as const satisfies readonly Vibe[];

export const ANSWER_SHAPES = [
	'story',
	'memory',
	'ranking',
	'tradeoff',
	'recommendation',
	'prediction',
] as const satisfies readonly AnswerShape[];

export const RECIPROCITY_MODES = [
	'one_person',
	'everyone_answers',
	'answer_then_ask',
	'pass_the_question',
] as const satisfies readonly ReciprocityMode[];

export const CONVERSATION_SKILLS = [
	'follow_up',
	'listen',
	'callback',
	'perspective_get',
	'common_ground',
	'repair',
] as const satisfies readonly ConversationSkill[];

// Full spark object — flat typed interface mapping 1:1 to future DB columns + one metadata bag.
// Fields without ? are required by the enrichment step in generate.remote.ts.
export interface Spark {
	// Identity
	id: string;
	content: string;

	// Serving / queryable fields (become top-level columns when the DB lands)
	relationship_context?: RelationshipContext;
	topic_lens?: TopicLens;
	setting?: Setting; // Legacy pre-v2 localStorage compatibility; not set on new sparks
	conversation_goal?: ConversationGoal;
	conversation_motive?: ConversationMotive;
	vibe?: Vibe;
	depth_level?: number; // 1–5
	controversy_level?: number; // 0–5
	humor_level?: number; // 0–5
	group_size_min?: number;
	group_size_max?: number;
	group_safety_level?: number; // 1–5
	answer_shape?: AnswerShape;
	reciprocity_mode?: ReciprocityMode;
	vulnerability_ramp?: VulnerabilityRamp;
	follow_up_potential?: number; // 1–5
	conversation_skill?: ConversationSkill;
	source_type?: SourceType;
	status?: Status;
	visibility?: Visibility;
	quality_score?: number;
	critique?: CritiqueResult;
	created_at: number; // ms since epoch (Date.now())
	updated_at?: number;

	// Legacy fields from pre-T3 sparks in localStorage — no longer set on new generations
	index?: number;
	type?: string;
	options?: unknown;

	// Escape hatch for experimental / rarely-queried output (maps to jsonb column later)
	metadata?: Record<string, unknown>;
}

// Backwards-compatible alias — existing consumers import `SparkData` from 'ts/sparks'
export type SparkData = Spark;
