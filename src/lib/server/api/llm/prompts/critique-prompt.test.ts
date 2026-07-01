import { describe, expect, it } from 'vitest';
import { buildCritiquePrompt } from './critique-prompt';
import type { Spark } from 'ts/spark';

const sampleSpark: Spark = {
	id: 'spark-1',
	content: 'What is a small moment that made you smile this week?',
	relationship_context: 'close_friend',
	setting: 'dinner',
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
		expect(prompt).toContain('dinner');
		expect(prompt).toContain('break_ice');
		expect(prompt).toContain('playful');
		expect(prompt).toContain('Depth level: 2');
		expect(prompt).toContain('What detail do you still remember?');
	});
});
