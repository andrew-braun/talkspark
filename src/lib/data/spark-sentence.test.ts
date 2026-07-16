import { describe, expect, it } from 'vitest';
import { buildSparkSentence, type SparkSentenceSegment } from './spark-sentence';
import { DEFAULT_LEVER_VALUE, type GenerationParams } from 'ts/params';

// Minimal params builder — every lever defaults to the sentinel unless overridden.
function makeParams(
	overrides: Partial<Record<string, string | number | string[]>> = {}
): GenerationParams {
	return {
		type: 'random',
		relationship_context: (overrides.relationship_context as never) ?? DEFAULT_LEVER_VALUE,
		topic_lens: (overrides.topic_lens as never) ?? DEFAULT_LEVER_VALUE,
		conversation_goal: (overrides.conversation_goal as never) ?? DEFAULT_LEVER_VALUE,
		vibe: (overrides.vibe as never) ?? DEFAULT_LEVER_VALUE,
		depth_and_safety: {
			depth_level: (overrides.depth_level as number) ?? DEFAULT_LEVER_VALUE,
			controversy_level: (overrides.controversy_level as number) ?? DEFAULT_LEVER_VALUE,
		},
		sensitive_topics: (overrides.sensitive_topics as never) ?? [],
	};
}

const fullText = (segments: SparkSentenceSegment[]) => segments.map((s) => s.text).join('');
const slots = (segments: SparkSentenceSegment[]) =>
	segments.filter((s): s is Extract<SparkSentenceSegment, { kind: 'slot' }> => s.kind === 'slot');

describe('buildSparkSentence', () => {
	it('returns the clean-state sentence when nothing is set', () => {
		const segments = buildSparkSentence(makeParams());
		expect(segments).toEqual([
			{ kind: 'text', text: 'Spark a wide-open conversation — anything goes.' },
		]);
		expect(slots(segments)).toHaveLength(0);
	});

	it('weaves the vibe in as the adjective before "conversation"', () => {
		const segments = buildSparkSentence(makeParams({ vibe: 'playful' }));
		expect(fullText(segments)).toBe('Spark a playful conversation.');
		expect(slots(segments)).toEqual([
			{ kind: 'slot', key: 'vibe', text: 'playful', colorVar: '--lever-vibe' },
		]);
	});

	it('renders the goal clause', () => {
		const segments = buildSparkSentence(makeParams({ conversation_goal: 'break_ice' }));
		expect(fullText(segments)).toBe('Spark a conversation to break the ice.');
		expect(slots(segments)[0]).toMatchObject({
			key: 'conversation_goal',
			text: 'break the ice',
		});
	});

	it('uses the article-aware relationship lead', () => {
		expect(
			fullText(buildSparkSentence(makeParams({ relationship_context: 'first_date' })))
		).toBe('Spark a conversation on a first date.');
		expect(fullText(buildSparkSentence(makeParams({ relationship_context: 'partner' })))).toBe(
			'Spark a conversation with your partner.'
		);
	});

	it('keeps ampersands literal in topic phrasing', () => {
		const segments = buildSparkSentence(makeParams({ topic_lens: 'stories_memories' }));
		expect(fullText(segments)).toBe('Spark a conversation about stories & memories.');
		expect(slots(segments)[0]).toMatchObject({ key: 'topic_lens', text: 'stories & memories' });
	});

	it('adds a trailing clause for depth alone', () => {
		expect(fullText(buildSparkSentence(makeParams({ depth_level: 4 })))).toBe(
			'Spark a conversation — kept deep.'
		);
	});

	it('adds a "kept it" clause for controversy alone', () => {
		expect(fullText(buildSparkSentence(makeParams({ controversy_level: 5 })))).toBe(
			'Spark a conversation — kept it wild.'
		);
	});

	it('treats controversy level 0 ("safe") as an explicit selection', () => {
		expect(fullText(buildSparkSentence(makeParams({ controversy_level: 0 })))).toBe(
			'Spark a conversation — kept it safe.'
		);
	});

	it('joins depth and controversy into one clause', () => {
		const segments = buildSparkSentence(makeParams({ depth_level: 4, controversy_level: 2 }));
		expect(fullText(segments)).toBe('Spark a conversation — kept deep and spicy.');
		expect(slots(segments).map((s) => s.key)).toEqual(['depth_level', 'controversy_level']);
	});

	it('adds a "touching on" clause for sensitive topics as one tappable slot', () => {
		const segments = buildSparkSentence(
			makeParams({ sensitive_topics: ['religion', 'politics'] })
		);
		expect(fullText(segments)).toBe('Spark a conversation, touching on religion & politics.');
		expect(slots(segments)).toEqual([
			{
				kind: 'slot',
				key: 'sensitive_topics',
				text: 'religion & politics',
				colorVar: '--lever-sensitive',
			},
		]);
	});

	it('joins three or more sensitive topics with commas and a final ampersand', () => {
		const segments = buildSparkSentence(
			makeParams({ sensitive_topics: ['sex', 'religion', 'politics'] })
		);
		expect(fullText(segments)).toBe(
			'Spark a conversation, touching on sex, religion & politics.'
		);
	});

	it('phrases a single sensitive topic without separators', () => {
		expect(
			fullText(buildSparkSentence(makeParams({ sensitive_topics: ['drugs_alcohol'] })))
		).toBe('Spark a conversation, touching on drugs & alcohol.');
	});

	it('orders every lever correctly when all are set', () => {
		const segments = buildSparkSentence(
			makeParams({
				vibe: 'playful',
				conversation_goal: 'break_ice',
				relationship_context: 'close_friend',
				topic_lens: 'hopes_plans',
				depth_level: 4,
				controversy_level: 2,
				sensitive_topics: ['money'],
			})
		);
		expect(fullText(segments)).toBe(
			'Spark a playful conversation to break the ice with a close friend about hopes & plans, touching on money — kept deep and spicy.'
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
