import { describe, expect, it } from 'vitest';
import { buildSparkSentence, type SparkSentenceSegment } from './spark-sentence';
import { DEFAULT_GENERATION_PARAMS } from 'lib/data/generation-options';
import type { GenerationParams } from 'ts/params';

const D = DEFAULT_GENERATION_PARAMS;

// Minimal params builder — every lever starts at its shipped concrete default unless overridden.
// The summary always names the six single-value levers; sensitive topics stay implicit until the
// selection differs from the full default set.
function makeParams(
	overrides: Partial<Record<string, string | number | string[]>> = {}
): GenerationParams {
	return {
		type: 'random',
		relationship_context: (overrides.relationship_context as never) ?? D.relationship_context,
		topic_lens: (overrides.topic_lens as never) ?? D.topic_lens,
		conversation_goal: (overrides.conversation_goal as never) ?? D.conversation_goal,
		vibe: (overrides.vibe as never) ?? D.vibe,
		depth_and_safety: {
			depth_level: (overrides.depth_level as number) ?? D.depth_and_safety!.depth_level,
			controversy_level:
				(overrides.controversy_level as number) ?? D.depth_and_safety!.controversy_level,
		},
		sensitive_topics: (overrides.sensitive_topics as never) ?? [...D.sensitive_topics!],
	};
}

const fullText = (segments: SparkSentenceSegment[]) => segments.map((s) => s.text).join('');
const slots = (segments: SparkSentenceSegment[]) =>
	segments.filter((s): s is Extract<SparkSentenceSegment, { kind: 'slot' }> => s.kind === 'slot');
const slot = (segments: SparkSentenceSegment[], key: string) =>
	slots(segments).find((s) => s.key === key)!;

describe('buildSparkSentence', () => {
	it('names all six single-value levers in their accent colours at the shipped default', () => {
		const segments = buildSparkSentence(makeParams());
		expect(fullText(segments)).toBe(
			'Spark a thoughtful conversation to just talk with anyone about anything — kept real and spicy.'
		);
		expect(slots(segments).map((s) => s.key)).toEqual([
			'vibe',
			'conversation_goal',
			'relationship_context',
			'topic_lens',
			'depth_level',
			'controversy_level',
		]);
		// Every lever word wears its own lever accent, default or not.
		expect(slots(segments).map((s) => s.colorVar)).toEqual([
			'--lever-vibe',
			'--lever-goal',
			'--lever-who',
			'--lever-topic',
			'--lever-depth',
			'--lever-safety',
		]);
	});

	it('accents the vibe when it is moved off the default', () => {
		const segments = buildSparkSentence(makeParams({ vibe: 'playful' }));
		expect(fullText(segments)).toBe(
			'Spark a playful conversation to just talk with anyone about anything — kept real and spicy.'
		);
		expect(slot(segments, 'vibe')).toMatchObject({ text: 'playful', colorVar: '--lever-vibe' });
	});

	it('renders and accents a customized goal', () => {
		const segments = buildSparkSentence(makeParams({ conversation_goal: 'break_ice' }));
		expect(fullText(segments)).toBe(
			'Spark a thoughtful conversation to break the ice with anyone about anything — kept real and spicy.'
		);
		expect(slot(segments, 'conversation_goal')).toMatchObject({
			text: 'break the ice',
			colorVar: '--lever-goal',
		});
	});

	it('uses the article-aware relationship lead', () => {
		expect(
			fullText(buildSparkSentence(makeParams({ relationship_context: 'first_date' })))
		).toBe(
			'Spark a thoughtful conversation to just talk on a first date about anything — kept real and spicy.'
		);
		expect(fullText(buildSparkSentence(makeParams({ relationship_context: 'partner' })))).toBe(
			'Spark a thoughtful conversation to just talk with your partner about anything — kept real and spicy.'
		);
	});

	it('keeps ampersands literal in topic phrasing', () => {
		const segments = buildSparkSentence(makeParams({ topic_lens: 'stories_memories' }));
		expect(fullText(segments)).toBe(
			'Spark a thoughtful conversation to just talk with anyone about stories & memories — kept real and spicy.'
		);
		expect(slot(segments, 'topic_lens')).toMatchObject({
			text: 'stories & memories',
			colorVar: '--lever-topic',
		});
	});

	it('reflects a customized depth word while controversy keeps its default', () => {
		const segments = buildSparkSentence(makeParams({ depth_level: 4 }));
		expect(fullText(segments)).toBe(
			'Spark a thoughtful conversation to just talk with anyone about anything — kept deep and spicy.'
		);
		expect(slot(segments, 'depth_level')).toMatchObject({
			text: 'deep',
			colorVar: '--lever-depth',
		});
		expect(slot(segments, 'controversy_level')).toMatchObject({
			text: 'spicy',
			colorVar: '--lever-safety',
		});
	});

	it('accents the controversy word when it is customized', () => {
		const segments = buildSparkSentence(makeParams({ controversy_level: 5 }));
		expect(fullText(segments)).toBe(
			'Spark a thoughtful conversation to just talk with anyone about anything — kept real and wild.'
		);
		expect(slot(segments, 'controversy_level')).toMatchObject({
			text: 'wild',
			colorVar: '--lever-safety',
		});
	});

	it('treats controversy level 0 ("safe") as a customization', () => {
		const segments = buildSparkSentence(makeParams({ controversy_level: 0 }));
		expect(fullText(segments)).toContain('kept real and safe.');
		expect(slot(segments, 'controversy_level').colorVar).toBe('--lever-safety');
	});

	it('accents both depth and controversy when both are customized', () => {
		const segments = buildSparkSentence(makeParams({ depth_level: 4, controversy_level: 3 }));
		expect(fullText(segments)).toContain('kept deep and bold.');
		expect(slot(segments, 'depth_level').colorVar).toBe('--lever-depth');
		expect(slot(segments, 'controversy_level').colorVar).toBe('--lever-safety');
	});

	it('adds a "touching on" clause for a narrowed sensitive set as one tappable slot', () => {
		const segments = buildSparkSentence(
			makeParams({ sensitive_topics: ['religion', 'politics'] })
		);
		expect(fullText(segments)).toBe(
			'Spark a thoughtful conversation to just talk with anyone about anything, touching on religion & politics — kept real and spicy.'
		);
		expect(slot(segments, 'sensitive_topics')).toMatchObject({
			text: 'religion & politics',
			colorVar: '--lever-sensitive',
		});
	});

	it('joins three or more sensitive topics with commas and a final ampersand', () => {
		const segments = buildSparkSentence(
			makeParams({ sensitive_topics: ['sex', 'religion', 'politics'] })
		);
		expect(fullText(segments)).toContain('touching on sex, religion & politics —');
	});

	it('keeps the full default sensitive-topic set implicit', () => {
		const segments = buildSparkSentence(
			makeParams({ sensitive_topics: [...D.sensitive_topics!] })
		);
		expect(slots(segments).some((s) => s.key === 'sensitive_topics')).toBe(false);
	});

	it('surfaces an explicit opt-out of every sensitive topic', () => {
		const segments = buildSparkSentence(makeParams({ sensitive_topics: [] }));
		expect(fullText(segments)).toBe(
			'Spark a thoughtful conversation to just talk with anyone about anything, no sensitive topics — kept real and spicy.'
		);
		expect(slot(segments, 'sensitive_topics')).toMatchObject({
			text: 'no sensitive topics',
			colorVar: '--lever-sensitive',
		});
	});

	it('phrases a single sensitive topic without separators', () => {
		expect(
			fullText(buildSparkSentence(makeParams({ sensitive_topics: ['drugs_alcohol'] })))
		).toContain('touching on drugs & alcohol —');
	});

	it('orders every lever correctly when all are customized', () => {
		const segments = buildSparkSentence(
			makeParams({
				vibe: 'playful',
				conversation_goal: 'break_ice',
				relationship_context: 'close_friend',
				topic_lens: 'hopes_plans',
				depth_level: 4,
				controversy_level: 3,
				sensitive_topics: ['money'],
			})
		);
		expect(fullText(segments)).toBe(
			'Spark a playful conversation to break the ice with a close friend about hopes & plans, touching on money — kept deep and bold.'
		);
		expect(slots(segments).map((s) => s.key)).toEqual([
			'vibe',
			'conversation_goal',
			'relationship_context',
			'topic_lens',
			'sensitive_topics',
			'depth_level',
			'controversy_level',
		]);
	});
});
