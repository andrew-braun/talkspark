import type { RelationshipContext, Setting, ConversationGoal, Vibe } from './spark';

// The four levers exposed on the generation surface (generation-engine.md).
// Depth & safety is split into two numeric fields so each can be controlled independently.
export interface DepthAndSafety {
	depth_level: number; // 1–5
	controversy_level: number; // 0–5
}

export interface GenerationParams {
	type: string; // 'random' | future types; kept for current generate.remote.ts compat
	relationship_context?: RelationshipContext;
	setting?: Setting;
	conversation_goal?: ConversationGoal;
	vibe?: Vibe;
	depth_and_safety?: DepthAndSafety;
}
