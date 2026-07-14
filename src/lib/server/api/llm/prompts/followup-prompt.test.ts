import { describe, expect, it } from 'vitest';
import { buildFollowupPrompt, FOLLOWUP_SYSTEM_INSTRUCTION, isTopicParent } from './followup-prompt';
import type { Spark } from 'ts/spark';
import type { Topic } from 'ts/topic';

const sampleSpark: Spark = {
	id: 'spark-1',
	content: 'What made you smile this week?',
	relationship_context: 'close_friend',
	topic_lens: 'stories_memories',
	conversation_goal: 'break_ice',
	vibe: 'playful',
	depth_level: 2,
	created_at: 1,
	metadata: { seed_follow_up: 'What detail stuck with you?' },
};

const sampleTopic: Topic = {
	id: 'topic-1',
	topic: 'Childhood road trips',
	vibe: 'nostalgic',
	depth_level: 3,
};

describe('buildFollowupPrompt', () => {
	it('includes parent spark content and seed follow-up', () => {
		const prompt = buildFollowupPrompt(sampleSpark);

		expect(prompt).toContain(sampleSpark.content);
		expect(prompt).toContain('What detail stuck with you?');
		expect(prompt).toContain('exactly three');
		expect(prompt).toContain('Topic lens: stories_memories');
		expect(prompt).toContain('Do not restate classification labels');
	});

	it('accepts legacy spark parents without using their setting', () => {
		const legacyParent: Spark = { ...sampleSpark, topic_lens: undefined, setting: 'dinner' };
		const prompt = buildFollowupPrompt(legacyParent);

		expect(prompt).not.toContain('Topic lens:');
		expect(prompt).not.toContain('Setting:');
	});

	it('includes topic when parent is a topic', () => {
		const prompt = buildFollowupPrompt(sampleTopic);

		expect(prompt).toContain('Childhood road trips');
		expect(prompt).not.toContain('Parent spark:');
	});

	it('preserves topic-parent controversy boundaries', () => {
		const parent: Topic = { ...sampleTopic, controversy_level: 4 };
		const prompt = buildFollowupPrompt(parent);

		expect(FOLLOWUP_SYSTEM_INSTRUCTION).toContain('controversy');
		expect(prompt).toContain('Controversy level: 4');
	});
});

describe('isTopicParent', () => {
	it('distinguishes topic parents from spark parents', () => {
		expect(isTopicParent(sampleSpark)).toBe(false);
		expect(isTopicParent(sampleTopic)).toBe(true);
	});
});
