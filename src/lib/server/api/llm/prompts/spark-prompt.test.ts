import { describe, expect, it } from 'vitest';
import { buildSparkPrompt } from './spark-prompt';
import { resolveGenerationParams } from 'lib/server/generation/resolve-params';

describe('buildSparkPrompt', () => {
	it('includes human-readable lever labels and depth values', () => {
		const resolved = resolveGenerationParams({
			type: 'random',
			relationship_context: 'family',
			setting: 'road_trip',
			conversation_goal: 'reflect',
			vibe: 'nostalgic',
			depth_and_safety: { depth_level: 4, controversy_level: 0 },
		});

		const prompt = buildSparkPrompt(resolved);

		expect(prompt).toContain('Family');
		expect(prompt).toContain('Road trip');
		expect(prompt).toContain('Reflect');
		expect(prompt).toContain('Nostalgic');
		expect(prompt).toContain('Depth level: 4');
		expect(prompt).toContain('Controversy level: 0');
	});

	it('requires all three spark_variant roles', () => {
		const prompt = buildSparkPrompt(resolveGenerationParams({ type: 'random' }));

		expect(prompt).toContain('"primary"');
		expect(prompt).toContain('"contrast"');
		expect(prompt).toContain('"playful_weird"');
		expect(prompt).toContain('exactly three');
	});
});
