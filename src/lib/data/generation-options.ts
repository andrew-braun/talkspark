import type { ConversationGoal, RelationshipContext, TopicLens, Vibe } from 'ts/spark';
import {
	DEFAULT_LEVER_VALUE,
	type DefaultLeverValue,
	type GenerationParams,
	type LeverSelection,
} from 'ts/params';

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

// Depth & safety are small bounded integer ranges (spark-taxonomy.md), rendered as named steps.
// Consumed only within this module (the LEVER_FIELDS scale entries below).
const DEPTH_LEVEL_MIN = 1;
const DEPTH_LEVEL_MAX = 5;
const CONTROVERSY_LEVEL_MIN = 0;
const CONTROVERSY_LEVEL_MAX = 5;

// Named steps for the depth/controversy scales — the sheet and sentence show these words
// instead of raw numbers. Arrays are index-aligned to the numeric level, so
// DEPTH_LEVEL_LABELS[level] / CONTROVERSY_LEVEL_LABELS[level] resolve directly. Depth is
// 1-based, so its index 0 is an unused filler; controversy is 0-based, so every slot is real.
// TODO(copy): confirm final wording with the generation-engine copy pass.
export const DEPTH_LEVEL_LABELS = [
	'',
	'Light',
	'Easygoing',
	'Real',
	'Deep',
	'Soul-baring',
] as const;
export const CONTROVERSY_LEVEL_LABELS = ['Safe', 'Mild', 'Spicy', 'Bold', 'Edgy', 'Wild'] as const;

// Automatic broad-neutral, zero-config selections (generation-engine.md "one-button default").
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

// ---- Lever registry -------------------------------------------------------------------
// Single source of truth for the six levers. The Customize sheet renders from it, the
// active-count badge iterates it, and the mad-libs sentence reads colours from it. Each
// entry owns how to read/write its slice of `generationParams`, so components stay generic
// and the store's shape (nested depth_and_safety) is known in exactly one place.

export type LeverKey =
	| 'relationship_context'
	| 'topic_lens'
	| 'conversation_goal'
	| 'vibe'
	| 'depth_level'
	| 'controversy_level';

// A lever's current selection: a string option value, a numeric scale level, or the
// DEFAULT_LEVER_VALUE sentinel when unset.
export type LeverValue = string | number;

// One accent hue per lever (design token names — values live in variables.css).
export const LEVER_COLOR_VARS: Record<LeverKey, string> = {
	relationship_context: '--lever-who',
	topic_lens: '--lever-topic',
	conversation_goal: '--lever-goal',
	vibe: '--lever-vibe',
	depth_level: '--lever-depth',
	controversy_level: '--lever-safety',
};

interface LeverFieldBase {
	key: LeverKey;
	sheetName: string;
	colorVar: string;
	get: (params: GenerationParams) => LeverValue;
	set: (params: GenerationParams, value: LeverValue) => void;
}

interface LeverSelectFieldDef extends LeverFieldBase {
	kind: 'select';
	options: readonly LeverOption<string>[];
}

interface LeverScaleFieldDef extends LeverFieldBase {
	kind: 'scale';
	min: number;
	max: number;
	labels: readonly string[]; // index-aligned to the numeric level
}

export type LeverFieldDef = LeverSelectFieldDef | LeverScaleFieldDef;

// Ensures depth_and_safety exists before writing either scale field.
const depthSafety = (params: GenerationParams) =>
	(params.depth_and_safety ??= {
		depth_level: DEFAULT_LEVER_VALUE,
		controversy_level: DEFAULT_LEVER_VALUE,
	});

export const LEVER_FIELDS: readonly LeverFieldDef[] = [
	{
		key: 'relationship_context',
		sheetName: "Who you're with",
		colorVar: LEVER_COLOR_VARS.relationship_context,
		kind: 'select',
		options: RELATIONSHIP_CONTEXT_OPTIONS,
		get: (p) => p.relationship_context ?? DEFAULT_LEVER_VALUE,
		set: (p, v) => {
			p.relationship_context = v as LeverSelection<RelationshipContext>;
		},
	},
	{
		key: 'topic_lens',
		sheetName: 'Topic lens',
		colorVar: LEVER_COLOR_VARS.topic_lens,
		kind: 'select',
		options: TOPIC_LENS_OPTIONS,
		get: (p) => p.topic_lens ?? DEFAULT_LEVER_VALUE,
		set: (p, v) => {
			p.topic_lens = v as LeverSelection<TopicLens>;
		},
	},
	{
		key: 'conversation_goal',
		sheetName: 'Conversation goal',
		colorVar: LEVER_COLOR_VARS.conversation_goal,
		kind: 'select',
		options: CONVERSATION_GOAL_OPTIONS,
		get: (p) => p.conversation_goal ?? DEFAULT_LEVER_VALUE,
		set: (p, v) => {
			p.conversation_goal = v as LeverSelection<ConversationGoal>;
		},
	},
	{
		key: 'vibe',
		sheetName: 'Vibe',
		colorVar: LEVER_COLOR_VARS.vibe,
		kind: 'select',
		options: VIBE_OPTIONS,
		get: (p) => p.vibe ?? DEFAULT_LEVER_VALUE,
		set: (p, v) => {
			p.vibe = v as LeverSelection<Vibe>;
		},
	},
	{
		key: 'depth_level',
		sheetName: 'Depth',
		colorVar: LEVER_COLOR_VARS.depth_level,
		kind: 'scale',
		min: DEPTH_LEVEL_MIN,
		max: DEPTH_LEVEL_MAX,
		labels: DEPTH_LEVEL_LABELS,
		get: (p) => p.depth_and_safety?.depth_level ?? DEFAULT_LEVER_VALUE,
		set: (p, v) => {
			depthSafety(p).depth_level = v as number | DefaultLeverValue;
		},
	},
	{
		key: 'controversy_level',
		sheetName: 'Safety / edge',
		colorVar: LEVER_COLOR_VARS.controversy_level,
		kind: 'scale',
		min: CONTROVERSY_LEVEL_MIN,
		max: CONTROVERSY_LEVEL_MAX,
		labels: CONTROVERSY_LEVEL_LABELS,
		get: (p) => p.depth_and_safety?.controversy_level ?? DEFAULT_LEVER_VALUE,
		set: (p, v) => {
			depthSafety(p).controversy_level = v as number | DefaultLeverValue;
		},
	},
];

// A lever counts as "set" whenever it isn't on the default sentinel. Note controversy
// level 0 ("Safe") is a real selection, distinct from DEFAULT_LEVER_VALUE.
export const isLeverSet = (value: LeverValue): boolean => value !== DEFAULT_LEVER_VALUE;

// Badge count: number of levers explicitly set, 0–6 (one per lever, per product decision).
export const activeLeverCount = (params: GenerationParams): number =>
	LEVER_FIELDS.reduce((n, field) => n + (isLeverSet(field.get(params)) ? 1 : 0), 0);
