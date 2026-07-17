import type {
	ConversationGoal,
	RelationshipContext,
	SensitiveTopic,
	TopicLens,
	Vibe,
} from './spark';

// The generation levers (generation-engine.md). Every lever carries a concrete value — there
// is no "automatic" sentinel; the broad/neutral choice is a real option (Anyone / Anything /
// Just talk / Real depth / Spicy controversy). See DEFAULT_GENERATION_PARAMS.
// Depth & safety is split into two numeric fields so each can be controlled independently.
export interface DepthAndSafety {
	depth_level: number; // 1–5
	controversy_level: number; // 0–5
}

export interface GenerationParams {
	type: string; // 'random' | future types; kept for current generate.remote.ts compat
	relationship_context?: RelationshipContext;
	topic_lens?: TopicLens;
	conversation_goal?: ConversationGoal;
	vibe?: Vibe;
	depth_and_safety?: DepthAndSafety;
	sensitive_topics?: SensitiveTopic[]; // multi-select; empty array = an explicit opt-out of all
}
