import { describe, expect, it } from 'vitest';
import { buildSparkPrompt, GENERATION_PROMPT_VERSION } from './spark-prompt';
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

	it('gives high depth and controversy levels materially stronger territory', () => {
		const prompt = buildSparkPrompt(
			resolveGenerationParams({
				type: 'random',
				depth_and_safety: { depth_level: 5, controversy_level: 5 },
			})
		);

		expect(prompt).toContain('identity, regret, fear, meaning, belonging');
		expect(prompt).toContain('genuinely divisive or taboo territory');
		expect(prompt).toContain('substantial disagreement');
		expect(prompt).toContain('never target participants or protected groups');
	});

	it('treats concrete numeric selections as targets and classifies content accurately', () => {
		const prompt = buildSparkPrompt(
			resolveGenerationParams({
				type: 'random',
				depth_and_safety: { depth_level: 5, controversy_level: 5 },
			})
		);

		expect(prompt).toContain('target intensities, not ceilings');
		expect(prompt).toContain('Use the requested levels fully');
		expect(prompt).toContain('Classify each spark accurately based on its actual content');
		expect(prompt).not.toContain('Classify each spark conservatively');
	});

	it('requires all three spark_variant roles', () => {
		const prompt = buildSparkPrompt(resolveGenerationParams({ type: 'random' }));

		expect(prompt).toContain('"primary"');
		expect(prompt).toContain('"contrast"');
		expect(prompt).toContain('"playful_weird"');
		expect(prompt).toContain('exactly three');
	});

	it('keeps sensitive subject matter low-key when no topics are requested', () => {
		const prompt = buildSparkPrompt(resolveGenerationParams({ type: 'random' }));

		expect(prompt).toContain('keep it low-key and uncontroversial');
		expect(prompt).not.toContain('explicitly allowed');
	});

	it('allows selected sensitive topics at the selected intensity', () => {
		const prompt = buildSparkPrompt(
			resolveGenerationParams({
				type: 'random',
				depth_and_safety: { depth_level: 2, controversy_level: 1 },
				sensitive_topics: ['religion', 'politics'],
			})
		);

		expect(prompt).toContain('religion and politics are explicitly allowed');
		expect(prompt).toContain('selected depth and controversy levels');
		expect(prompt).not.toContain('At this intensity');
	});

	it('encourages sensitive territory in general at high intensity', () => {
		const depthPrompt = buildSparkPrompt(
			resolveGenerationParams({
				type: 'random',
				depth_and_safety: { depth_level: 4, controversy_level: 'default' },
			})
		);
		const controversyPrompt = buildSparkPrompt(
			resolveGenerationParams({
				type: 'random',
				depth_and_safety: { depth_level: 'default', controversy_level: 4 },
			})
		);

		expect(depthPrompt).toContain('At this intensity, actively explore sensitive territory');
		expect(controversyPrompt).toContain(
			'At this intensity, actively explore sensitive territory'
		);
	});

	it('does not encourage sensitive territory below the high-intensity threshold', () => {
		const prompt = buildSparkPrompt(
			resolveGenerationParams({
				type: 'random',
				depth_and_safety: { depth_level: 3, controversy_level: 3 },
			})
		);

		expect(prompt).not.toContain('At this intensity');
	});

	it('identifies the calibrated prompt as version 4', () => {
		expect(GENERATION_PROMPT_VERSION).toBe('v4');
	});
});
