import type { RelationshipContext, Setting, ConversationGoal, Vibe } from 'ts/spark';
import type { GenerationParams } from 'ts/params';

export interface LeverOption<T extends string> {
	value: T;
	label: string;
}

// Label sets for the four generation levers (generation-engine.md). Order controls display order.
export const RELATIONSHIP_CONTEXT_OPTIONS: LeverOption<RelationshipContext>[] = [
	{ value: 'first_date', label: 'First date' },
	{ value: 'partner', label: 'Partner' },
	{ value: 'family', label: 'Family' },
	{ value: 'close_friend', label: 'Close friend' },
	{ value: 'coworker', label: 'Coworker' },
	{ value: 'team', label: 'Team' },
	{ value: 'stranger', label: 'Stranger' },
];

export const SETTING_OPTIONS: LeverOption<Setting>[] = [
	{ value: 'dinner', label: 'Dinner' },
	{ value: 'road_trip', label: 'Road trip' },
	{ value: 'meeting', label: 'Meeting' },
	{ value: 'classroom', label: 'Classroom' },
	{ value: 'party', label: 'Party' },
	{ value: 'online_chat', label: 'Online chat' },
];

export const CONVERSATION_GOAL_OPTIONS: LeverOption<ConversationGoal>[] = [
	{ value: 'break_ice', label: 'Break the ice' },
	{ value: 'reconnect', label: 'Reconnect' },
	{ value: 'laugh', label: 'Laugh' },
	{ value: 'reflect', label: 'Reflect' },
	{ value: 'repair', label: 'Repair' },
	{ value: 'debate', label: 'Debate' },
	{ value: 'brainstorm', label: 'Brainstorm' },
];

export const VIBE_OPTIONS: LeverOption<Vibe>[] = [
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
	relationship_context: 'close_friend',
	setting: 'dinner',
	conversation_goal: 'break_ice',
	vibe: 'playful',
	depth_and_safety: {
		depth_level: 2,
		controversy_level: 1,
	},
};
