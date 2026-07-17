import {
	CONTROVERSY_LEVEL_LABELS,
	DEFAULT_GENERATION_PARAMS,
	DEPTH_LEVEL_LABELS,
	LEVER_COLOR_VARS,
	SENSITIVE_TOPIC_OPTIONS,
	type LeverKey,
} from 'lib/data/generation-options';
import type { GenerationParams } from 'ts/params';

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
	anyone: { lead: 'with ', word: 'anyone' },
	first_date: { lead: 'on ', word: 'a first date' },
	partner: { lead: 'with ', word: 'your partner' },
	family: { lead: 'with ', word: 'family' },
	close_friend: { lead: 'with ', word: 'a close friend' },
	coworker: { lead: 'with ', word: 'a coworker' },
	team: { lead: 'with ', word: 'your team' },
	stranger: { lead: 'with ', word: 'a stranger' },
};

const GOAL_PHRASE: Record<string, string> = {
	just_talk: 'just talk',
	break_ice: 'break the ice',
	reconnect: 'reconnect',
	laugh: 'laugh',
	reflect: 'reflect',
	repair: 'repair',
	debate: 'debate',
	brainstorm: 'brainstorm',
};

const TOPIC_PHRASE: Record<string, string> = {
	anything: 'anything',
	everyday_life: 'everyday life',
	stories_memories: 'stories & memories',
	interests_culture: 'interests & culture',
	hopes_plans: 'hopes & plans',
	ideas_perspectives: 'ideas & perspectives',
	imagination_hypotheticals: 'imagination & hypotheticals',
};

// Vibe is the adjective before "conversation" (always shown, including the default).
const VIBE_PHRASE: Record<string, string> = {
	playful: 'playful',
	warm: 'warm',
	thoughtful: 'thoughtful',
	weird: 'weird',
	romantic: 'romantic',
	nostalgic: 'nostalgic',
};

const SENSITIVE_TOPIC_PHRASE: Record<string, string> = {
	sex: 'sex',
	religion: 'religion',
	politics: 'politics',
	death: 'death',
	money: 'money',
	drugs_alcohol: 'drugs & alcohol',
	mental_health: 'mental health',
};

// "sex, religion & politics" — commas between items, ampersand before the last.
const joinPhrases = (phrases: string[]): string =>
	phrases.length <= 1
		? (phrases[0] ?? '')
		: `${phrases.slice(0, -1).join(', ')} & ${phrases[phrases.length - 1]}`;

const SENSITIVE_TOPIC_COUNT = SENSITIVE_TOPIC_OPTIONS.length;
const D = DEFAULT_GENERATION_PARAMS;

/**
 * Builds the front-facing mad-libs summary of the current picker state. The six single-value
 * levers are always named (relationship, topic, goal, vibe, depth, controversy) so the reader
 * sees the full setup at a glance; each is a tappable slot in its lever's accent colour, whether
 * default or customized. Sensitive topics stay implicit at the full default set and surface only
 * when narrowed (", touching on …") or fully opted out (", no sensitive topics").
 */
export function buildSparkSentence(params: GenerationParams): SparkSentenceSegment[] {
	const relationship = params.relationship_context ?? D.relationship_context!;
	const topic = params.topic_lens ?? D.topic_lens!;
	const goal = params.conversation_goal ?? D.conversation_goal!;
	const vibe = params.vibe ?? D.vibe!;
	const depth = params.depth_and_safety?.depth_level ?? D.depth_and_safety!.depth_level;
	const controversy =
		params.depth_and_safety?.controversy_level ?? D.depth_and_safety!.controversy_level;
	const topics = params.sensitive_topics ?? [];

	const topicsCustomized = topics.length !== SENSITIVE_TOPIC_COUNT;

	const segments: SparkSentenceSegment[] = [];
	const text = (value: string) => segments.push({ kind: 'text', text: value });
	const slot = (key: LeverKey, value: string) =>
		segments.push({ kind: 'slot', key, text: value, colorVar: LEVER_COLOR_VARS[key] });

	const relPhrase = RELATIONSHIP_PHRASE[relationship];
	const depthWord = DEPTH_LEVEL_LABELS[depth as number]?.toLowerCase() ?? '';
	const controversyWord = CONTROVERSY_LEVEL_LABELS[controversy as number]?.toLowerCase() ?? '';

	text('Spark a ');
	slot('vibe', VIBE_PHRASE[vibe]);
	text(' conversation to ');
	slot('conversation_goal', GOAL_PHRASE[goal]);
	text(' ' + relPhrase.lead);
	slot('relationship_context', relPhrase.word);
	text(' about ');
	slot('topic_lens', TOPIC_PHRASE[topic]);

	if (topicsCustomized) {
		// One slot for the whole selection — tapping opens the sheet focused on the lever. Only a
		// narrowed list or an empty opt-out shows; the full default set stays implicit.
		if (topics.length === 0) {
			text(', ');
			slot('sensitive_topics', 'no sensitive topics');
		} else {
			text(', touching on ');
			slot(
				'sensitive_topics',
				joinPhrases(topics.map((value) => SENSITIVE_TOPIC_PHRASE[value]))
			);
		}
	}

	text(' — kept ');
	slot('depth_level', depthWord);
	text(' and ');
	slot('controversy_level', controversyWord);
	text('.');
	return segments;
}
