import { describe, expect, it } from 'vitest';
import { buildSparkPrompt } from './spark-prompt';
import { resolveGenerationParams } from 'lib/server/generation/resolve-params';

describe('buildSparkPrompt', () => {
	it('assigns concrete levers behavioral responsibilities', () => {
		const prompt = buildSparkPrompt(
			resolveGenerationParams({
				type: 'random',
				relationship_context: 'family',
				topic_lens: 'stories_memories',
				conversation_goal: 'reflect',
				vibe: 'nostalgic',
				depth_and_safety: { depth_level: 4, controversy_level: 0 },
			})
		);

		expect(prompt).toContain('Stories & memories');
		expect(prompt).toContain('assumed familiarity');
		expect(prompt).toContain('source territory');
		expect(prompt).toContain('conversation trajectory');
		expect(prompt).toContain('tone and phrasing');
		expect(prompt).toContain('Do not mention or paraphrase lever labels');
		expect(prompt).not.toContain('People & setting');
	});

	it('translates Default selections into broad-neutral behavior', () => {
		const prompt = buildSparkPrompt(resolveGenerationParams({ type: 'random' }));

		expect(prompt).toContain('work across relationship types');
		expect(prompt).toContain('choose an accessible topic territory');
		expect(prompt).toContain('natural, inviting tone');
		expect(prompt).toContain('choose a broadly accessible, low-risk level');
		expect(prompt).not.toContain('Relationship: Default');
	});

	it('requires all three spark_variant roles', () => {
		const prompt = buildSparkPrompt(resolveGenerationParams({ type: 'random' }));

		expect(prompt).toContain('"primary"');
		expect(prompt).toContain('"contrast"');
		expect(prompt).toContain('"playful_weird"');
		expect(prompt).toContain('exactly three');
	});
});
