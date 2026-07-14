import type { ConversationGoal, RelationshipContext, TopicLens, Vibe } from 'ts/spark';
import { DEFAULT_LEVER_VALUE, type GenerationParams, type LeverSelection } from 'ts/params';

export interface LeverOption<T extends string> {
	value: T;
	label: string;
}

// Label sets for the four generation levers (generation-engine.md). Order controls display order.
export const RELATIONSHIP_CONTEXT_OPTIONS: LeverOption<LeverSelection<RelationshipContext>>[] = [
	{ value: DEFAULT_LEVER_VALUE, label: 'Default' },
	{ value: 'first_date', label: 'First date' },
	{ value: 'partner', label: 'Partner' },
	{ value: 'family', label: 'Family' },
	{ value: 'close_friend', label: 'Close friend' },
	{ value: 'coworker', label: 'Coworker' },
	{ value: 'team', label: 'Team' },
	{ value: 'stranger', label: 'Stranger' },
];

export const TOPIC_LENS_OPTIONS: LeverOption<LeverSelection<TopicLens>>[] = [
	{ value: DEFAULT_LEVER_VALUE, label: 'Default' },
	{ value: 'everyday_life', label: 'Everyday life' },
	{ value: 'stories_memories', label: 'Stories & memories' },
	{ value: 'interests_culture', label: 'Interests & culture' },
	{ value: 'hopes_plans', label: 'Hopes & plans' },
	{ value: 'ideas_perspectives', label: 'Ideas & perspectives' },
	{ value: 'imagination_hypotheticals', label: 'Imagination & hypotheticals' },
];

export const CONVERSATION_GOAL_OPTIONS: LeverOption<LeverSelection<ConversationGoal>>[] = [
	{ value: DEFAULT_LEVER_VALUE, label: 'Default' },
	{ value: 'break_ice', label: 'Break the ice' },
	{ value: 'reconnect', label: 'Reconnect' },
	{ value: 'laugh', label: 'Laugh' },
	{ value: 'reflect', label: 'Reflect' },
	{ value: 'repair', label: 'Repair' },
	{ value: 'debate', label: 'Debate' },
	{ value: 'brainstorm', label: 'Brainstorm' },
];

export const VIBE_OPTIONS: LeverOption<LeverSelection<Vibe>>[] = [
	{ value: DEFAULT_LEVER_VALUE, label: 'Default' },
	{ value: 'playful', label: 'Playful' },
	{ value: 'warm', label: 'Warm' },
	{ value: 'thoughtful', label: 'Thoughtful' },
	{ value: 'weird', label: 'Weird' },
	{ value: 'romantic', label: 'Romantic' },
	{ value: 'nostalgic', label: 'Nostalgic' },
];

// Depth & safety are small bounded integer ranges (spark-taxonomy.md), rendered as numbered steps.
export const DEPTH_LEVEL_MIN = 1;
export const DEPTH_LEVEL_MAX = 5;
export const CONTROVERSY_LEVEL_MIN = 0;
export const CONTROVERSY_LEVEL_MAX = 5;

// Most generally-optimal, zero-config selections (generation-engine.md "one-button default").
export const DEFAULT_GENERATION_PARAMS: GenerationParams = {
	type: 'random',
	relationship_context: DEFAULT_LEVER_VALUE,
	topic_lens: DEFAULT_LEVER_VALUE,
	conversation_goal: DEFAULT_LEVER_VALUE,
	vibe: DEFAULT_LEVER_VALUE,
	depth_and_safety: {
		depth_level: DEFAULT_LEVER_VALUE,
		controversy_level: DEFAULT_LEVER_VALUE,
	},
};
