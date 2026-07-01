import { describe, expect, it } from 'vitest';
import { buildFollowupPrompt, isTopicParent } from './followup-prompt';
import type { Spark } from 'ts/spark';
import type { Topic } from 'ts/topic';

const sampleSpark: Spark = {
	id: 'spark-1',
	content: 'What made you smile this week?',
	relationship_context: 'close_friend',
	setting: 'dinner',
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
	});

	it('includes topic when parent is a topic', () => {
		const prompt = buildFollowupPrompt(sampleTopic);

		expect(prompt).toContain('Childhood road trips');
		expect(prompt).not.toContain('Parent spark:');
	});
});

describe('isTopicParent', () => {
	it('distinguishes topic parents from spark parents', () => {
		expect(isTopicParent(sampleSpark)).toBe(false);
		expect(isTopicParent(sampleTopic)).toBe(true);
	});
});
