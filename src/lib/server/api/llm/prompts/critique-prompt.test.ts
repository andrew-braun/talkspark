import { describe, expect, it } from 'vitest';
import { buildBatchCritiquePrompt, buildCritiquePrompt } from './critique-prompt';
import type { Spark } from 'ts/spark';

const sampleSpark: Spark = {
	id: 'spark-1',
	content: 'What is a small moment that made you smile this week?',
	relationship_context: 'close_friend',
	topic_lens: 'stories_memories',
	conversation_goal: 'break_ice',
	vibe: 'playful',
	depth_level: 2,
	controversy_level: 1,
	created_at: 1_700_000_000_000,
	metadata: {
		seed_follow_up: 'What detail do you still remember?',
	},
};

describe('buildCritiquePrompt', () => {
	it('includes spark content and context fields', () => {
		const prompt = buildCritiquePrompt(sampleSpark);

		expect(prompt).toContain(sampleSpark.content);
		expect(prompt).toContain('close_friend');
		expect(prompt).toContain('Topic lens: stories_memories');
		expect(prompt).toContain('break_ice');
		expect(prompt).toContain('playful');
		expect(prompt).toContain('Depth level: 2');
		expect(prompt).toContain('What detail do you still remember?');
		expect(prompt).toContain('Merely mentioning a context label does not count as context fit');
	});
});

describe('buildBatchCritiquePrompt', () => {
	it('includes each spark and asks for independent scoring', () => {
		const sparks: Spark[] = [
			{
				...sampleSpark,
				id: 'spark-1',
				content: 'Primary question?',
				metadata: { spark_variant: 'primary' },
			},
			{
				...sampleSpark,
				id: 'spark-2',
				content: 'Contrast question?',
				metadata: { spark_variant: 'contrast' },
			},
		];

		const prompt = buildBatchCritiquePrompt(sparks);

		expect(prompt).toContain('Primary question?');
		expect(prompt).toContain('Contrast question?');
		expect(prompt).toContain('spark_variant: "primary"');
		expect(prompt).toContain('spark_variant: "contrast"');
		expect(prompt).toContain('independently');
		expect(prompt).toContain('do not rank or compare');
	});
});
