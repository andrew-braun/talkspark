import type { ConversationGoal, RelationshipContext, TopicLens, Vibe } from './spark';

export const DEFAULT_LEVER_VALUE = 'default' as const;
export type DefaultLeverValue = typeof DEFAULT_LEVER_VALUE;
export type LeverSelection<T extends string> = T | DefaultLeverValue;

// The four levers exposed on the generation surface (generation-engine.md).
// Depth & safety is split into two numeric fields so each can be controlled independently.
export interface DepthAndSafety {
	depth_level: number | DefaultLeverValue; // 1–5 or automatic
	controversy_level: number | DefaultLeverValue; // 0–5 or automatic
}

export interface GenerationParams {
	type: string; // 'random' | future types; kept for current generate.remote.ts compat
	relationship_context?: LeverSelection<RelationshipContext>;
	topic_lens?: LeverSelection<TopicLens>;
	conversation_goal?: LeverSelection<ConversationGoal>;
	vibe?: LeverSelection<Vibe>;
	depth_and_safety?: DepthAndSafety;
}
