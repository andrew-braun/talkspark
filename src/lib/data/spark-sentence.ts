import {
	CONTROVERSY_LEVEL_LABELS,
	DEPTH_LEVEL_LABELS,
	LEVER_COLOR_VARS,
	type LeverKey,
} from 'lib/data/generation-options';
import { DEFAULT_LEVER_VALUE, type GenerationParams } from 'ts/params';

// The mad-libs summary is emitted as ordered segments so the Svelte component just maps
// each to a span (plain text) or a tappable button (a lever "slot"). Keeping the grammar
// here — pure and framework-free — makes it unit-testable and keeps markup logic-free.
interface SentenceTextSegment {
	kind: 'text';
	text: string;
}

interface SentenceSlotSegment {
	kind: 'slot';
	key: LeverKey; // which lever tapping this word opens
	text: string;
	colorVar: string; // the lever's accent token
}

export type SparkSentenceSegment = SentenceTextSegment | SentenceSlotSegment;

// Grammar maps keyed by option value. The sentence phrasing differs from the sheet labels
// (e.g. option "Break the ice" → clause "break the ice"), so these are their own source.
const RELATIONSHIP_PHRASE: Record<string, { lead: string; word: string }> = {
	first_date: { lead: 'on ', word: 'a first date' },
	partner: { lead: 'with ', word: 'your partner' },
	family: { lead: 'with ', word: 'family' },
	close_friend: { lead: 'with ', word: 'a close friend' },
	coworker: { lead: 'with ', word: 'a coworker' },
	team: { lead: 'with ', word: 'your team' },
	stranger: { lead: 'with ', word: 'a stranger' },
};

const GOAL_PHRASE: Record<string, string> = {
	break_ice: 'break the ice',
	reconnect: 'reconnect',
	laugh: 'laugh',
	reflect: 'reflect',
	repair: 'repair',
	debate: 'debate',
	brainstorm: 'brainstorm',
};

const TOPIC_PHRASE: Record<string, string> = {
	everyday_life: 'everyday life',
	stories_memories: 'stories & memories',
	interests_culture: 'interests & culture',
	hopes_plans: 'hopes & plans',
	ideas_perspectives: 'ideas & perspectives',
	imagination_hypotheticals: 'imagination & hypotheticals',
};

// Vibe is the adjective before "conversation" (dropped when default).
const VIBE_PHRASE: Record<string, string> = {
	playful: 'playful',
	warm: 'warm',
	thoughtful: 'thoughtful',
	weird: 'weird',
	romantic: 'romantic',
	nostalgic: 'nostalgic',
};

const CLEAN_SENTENCE = 'Spark a wide-open conversation — anything goes.';

const isSet = (value: unknown): boolean => value !== DEFAULT_LEVER_VALUE;

/**
 * Builds the front-facing mad-libs summary of the current picker state. Names only the
 * levers that are set, growing as choices are made; each set value becomes a tappable slot.
 * With nothing set, returns the single clean-state sentence.
 */
export function buildSparkSentence(params: GenerationParams): SparkSentenceSegment[] {
	const relationship = params.relationship_context ?? DEFAULT_LEVER_VALUE;
	const topic = params.topic_lens ?? DEFAULT_LEVER_VALUE;
	const goal = params.conversation_goal ?? DEFAULT_LEVER_VALUE;
	const vibe = params.vibe ?? DEFAULT_LEVER_VALUE;
	const depth = params.depth_and_safety?.depth_level ?? DEFAULT_LEVER_VALUE;
	const controversy = params.depth_and_safety?.controversy_level ?? DEFAULT_LEVER_VALUE;

	const anySet =
		isSet(relationship) ||
		isSet(topic) ||
		isSet(goal) ||
		isSet(vibe) ||
		isSet(depth) ||
		isSet(controversy);
	if (!anySet) return [{ kind: 'text', text: CLEAN_SENTENCE }];

	const segments: SparkSentenceSegment[] = [];
	const text = (value: string) => segments.push({ kind: 'text', text: value });
	const slot = (key: LeverKey, value: string) =>
		segments.push({ kind: 'slot', key, text: value, colorVar: LEVER_COLOR_VARS[key] });

	text('Spark a ');
	if (isSet(vibe)) {
		slot('vibe', VIBE_PHRASE[vibe as string]);
		text(' conversation');
	} else {
		text('conversation');
	}
	if (isSet(goal)) {
		text(' to ');
		slot('conversation_goal', GOAL_PHRASE[goal as string]);
	}
	if (isSet(relationship)) {
		const phrase = RELATIONSHIP_PHRASE[relationship as string];
		text(' ' + phrase.lead);
		slot('relationship_context', phrase.word);
	}
	if (isSet(topic)) {
		text(' about ');
		slot('topic_lens', TOPIC_PHRASE[topic as string]);
	}

	const hasDepth = isSet(depth);
	const hasControversy = isSet(controversy);
	const depthWord = DEPTH_LEVEL_LABELS[depth as number]?.toLowerCase() ?? '';
	const controversyWord = CONTROVERSY_LEVEL_LABELS[controversy as number]?.toLowerCase() ?? '';
	if (hasDepth && hasControversy) {
		text(' — kept ');
		slot('depth_level', depthWord);
		text(' and ');
		slot('controversy_level', controversyWord);
	} else if (hasDepth) {
		text(' — kept ');
		slot('depth_level', depthWord);
	} else if (hasControversy) {
		text(' — kept it ');
		slot('controversy_level', controversyWord);
	}

	text('.');
	return segments;
}
