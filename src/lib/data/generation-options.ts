import type {
	ConversationGoal,
	RelationshipContext,
	SensitiveTopic,
	TopicLens,
	Vibe,
} from 'ts/spark';
import type { GenerationParams } from 'ts/params';

export interface LeverOption<T extends string> {
	value: T;
	label: string;
}

// Label sets for the generation levers (generation-engine.md). Order controls display order.
// The first entry of each single-select lever is its concrete default — a real, nameable
// "no particular constraint" choice (Anyone / Anything / Just talk), not an automatic sentinel.
export const RELATIONSHIP_CONTEXT_OPTIONS: LeverOption<RelationshipContext>[] = [
	{ value: 'anyone', label: 'Anyone' },
	{ value: 'first_date', label: 'First date' },
	{ value: 'partner', label: 'Partner' },
	{ value: 'family', label: 'Family' },
	{ value: 'close_friend', label: 'Close friend' },
	{ value: 'coworker', label: 'Coworker' },
	{ value: 'team', label: 'Team' },
	{ value: 'stranger', label: 'Stranger' },
];

export const TOPIC_LENS_OPTIONS: LeverOption<TopicLens>[] = [
	{ value: 'anything', label: 'Anything' },
	{ value: 'everyday_life', label: 'Everyday life' },
	{ value: 'stories_memories', label: 'Stories & memories' },
	{ value: 'interests_culture', label: 'Interests & culture' },
	{ value: 'hopes_plans', label: 'Hopes & plans' },
	{ value: 'ideas_perspectives', label: 'Ideas & perspectives' },
	{ value: 'imagination_hypotheticals', label: 'Imagination & hypotheticals' },
];

export const CONVERSATION_GOAL_OPTIONS: LeverOption<ConversationGoal>[] = [
	{ value: 'just_talk', label: 'Just talk' },
	{ value: 'break_ice', label: 'Break the ice' },
	{ value: 'reconnect', label: 'Reconnect' },
	{ value: 'laugh', label: 'Laugh' },
	{ value: 'reflect', label: 'Reflect' },
	{ value: 'repair', label: 'Repair' },
	{ value: 'debate', label: 'Debate' },
	{ value: 'brainstorm', label: 'Brainstorm' },
];

// Vibe has no neutral "anything" option — Thoughtful is the shipped default.
export const VIBE_OPTIONS: LeverOption<Vibe>[] = [
	{ value: 'thoughtful', label: 'Thoughtful' },
	{ value: 'playful', label: 'Playful' },
	{ value: 'warm', label: 'Warm' },
	{ value: 'weird', label: 'Weird' },
	{ value: 'romantic', label: 'Romantic' },
	{ value: 'nostalgic', label: 'Nostalgic' },
];

// Multi-select lever: no Default entry — an empty selection is the default state.
export const SENSITIVE_TOPIC_OPTIONS: LeverOption<SensitiveTopic>[] = [
	{ value: 'sex', label: 'Sex' },
	{ value: 'religion', label: 'Religion' },
	{ value: 'politics', label: 'Politics' },
	{ value: 'death', label: 'Death' },
	{ value: 'money', label: 'Money' },
	{ value: 'drugs_alcohol', label: 'Drugs & alcohol' },
	{ value: 'mental_health', label: 'Mental health' },
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

// Opinionated zero-config defaults (generation-engine.md "one-button default"). The baseline
// deliberately leans deep and edgy — Real depth, Spicy controversy, and every sensitive topic
// on (opt-out, not opt-in). Every categorical lever also carries a concrete default (Anyone /
// Anything / Just talk / Thoughtful) so the summary sentence can always name it; these read as
// broad/neutral to the generator but are real values, not an automatic sentinel.
export const DEFAULT_GENERATION_PARAMS: GenerationParams = {
	type: 'random',
	relationship_context: 'anyone',
	topic_lens: 'anything',
	conversation_goal: 'just_talk',
	vibe: 'thoughtful',
	depth_and_safety: {
		depth_level: 3, // Real
		controversy_level: 2, // Spicy — the threshold where sensitive topics come into play
	},
	sensitive_topics: SENSITIVE_TOPIC_OPTIONS.map((option) => option.value),
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
	| 'controversy_level'
	| 'sensitive_topics';

// A lever's current selection: a string option value, a numeric scale level, or a multi-select
// array of option values (empty = an explicit opt-out).
export type LeverValue = string | number | readonly string[];

// One accent hue per lever (design token names — values live in variables.css).
export const LEVER_COLOR_VARS: Record<LeverKey, string> = {
	relationship_context: '--lever-who',
	topic_lens: '--lever-topic',
	conversation_goal: '--lever-goal',
	vibe: '--lever-vibe',
	depth_level: '--lever-depth',
	controversy_level: '--lever-safety',
	sensitive_topics: '--lever-sensitive',
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

// Multi-select lever: value is an array of option values; empty array = unset.
interface LeverMultiFieldDef extends LeverFieldBase {
	kind: 'multi';
	options: readonly LeverOption<string>[];
}

export type LeverFieldDef = LeverSelectFieldDef | LeverScaleFieldDef | LeverMultiFieldDef;

// Ensures depth_and_safety exists before writing either scale field, seeding it with the
// concrete Real/Spicy defaults so the other field keeps a sensible value.
const depthSafety = (params: GenerationParams) =>
	(params.depth_and_safety ??= {
		depth_level: DEFAULT_GENERATION_PARAMS.depth_and_safety!.depth_level,
		controversy_level: DEFAULT_GENERATION_PARAMS.depth_and_safety!.controversy_level,
	});

export const LEVER_FIELDS: readonly LeverFieldDef[] = [
	{
		key: 'relationship_context',
		sheetName: "Who you're with",
		colorVar: LEVER_COLOR_VARS.relationship_context,
		kind: 'select',
		options: RELATIONSHIP_CONTEXT_OPTIONS,
		get: (p) => p.relationship_context ?? DEFAULT_GENERATION_PARAMS.relationship_context!,
		set: (p, v) => {
			p.relationship_context = v as RelationshipContext;
		},
	},
	{
		key: 'topic_lens',
		sheetName: 'Topic lens',
		colorVar: LEVER_COLOR_VARS.topic_lens,
		kind: 'select',
		options: TOPIC_LENS_OPTIONS,
		get: (p) => p.topic_lens ?? DEFAULT_GENERATION_PARAMS.topic_lens!,
		set: (p, v) => {
			p.topic_lens = v as TopicLens;
		},
	},
	{
		key: 'conversation_goal',
		sheetName: 'Conversation goal',
		colorVar: LEVER_COLOR_VARS.conversation_goal,
		kind: 'select',
		options: CONVERSATION_GOAL_OPTIONS,
		get: (p) => p.conversation_goal ?? DEFAULT_GENERATION_PARAMS.conversation_goal!,
		set: (p, v) => {
			p.conversation_goal = v as ConversationGoal;
		},
	},
	{
		key: 'vibe',
		sheetName: 'Vibe',
		colorVar: LEVER_COLOR_VARS.vibe,
		kind: 'select',
		options: VIBE_OPTIONS,
		get: (p) => p.vibe ?? DEFAULT_GENERATION_PARAMS.vibe!,
		set: (p, v) => {
			p.vibe = v as Vibe;
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
		get: (p) =>
			p.depth_and_safety?.depth_level ??
			DEFAULT_GENERATION_PARAMS.depth_and_safety!.depth_level,
		set: (p, v) => {
			depthSafety(p).depth_level = v as number;
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
		get: (p) =>
			p.depth_and_safety?.controversy_level ??
			DEFAULT_GENERATION_PARAMS.depth_and_safety!.controversy_level,
		set: (p, v) => {
			depthSafety(p).controversy_level = v as number;
		},
	},
	{
		key: 'sensitive_topics',
		sheetName: 'Sensitive topics',
		colorVar: LEVER_COLOR_VARS.sensitive_topics,
		kind: 'multi',
		options: SENSITIVE_TOPIC_OPTIONS,
		get: (p) => p.sensitive_topics ?? [],
		set: (p, v) => {
			p.sensitive_topics = [...(v as SensitiveTopic[])];
		},
	},
];

// Order-independent equality for lever values: a set-compare for multi-select arrays,
// strict equality otherwise.
const leverValuesEqual = (a: LeverValue, b: LeverValue): boolean => {
	if (Array.isArray(a) || Array.isArray(b)) {
		const x = (Array.isArray(a) ? a : []) as readonly string[];
		const y = (Array.isArray(b) ? b : []) as readonly string[];
		return x.length === y.length && x.every((value) => y.includes(value));
	}
	return a === b;
};

// A lever is "active" (accented, counted on the badge) when it differs from the shipped
// default. Every lever now has a concrete default (Anyone / Anything / Just talk / Thoughtful /
// Real / Spicy / all sensitive topics), so "active" means "customized away from the default":
// the Anyone/Real/Spicy baseline reads as inactive until the user moves it.
export const isLeverActive = (field: LeverFieldDef, value: LeverValue): boolean =>
	!leverValuesEqual(value, field.get(DEFAULT_GENERATION_PARAMS));

// Badge count: number of levers customized away from the default, 0–7 (one per lever).
export const activeLeverCount = (params: GenerationParams): number =>
	LEVER_FIELDS.reduce((n, field) => n + (isLeverActive(field, field.get(params)) ? 1 : 0), 0);
