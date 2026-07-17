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

	it('translates the neutral defaults into broad-neutral behavior', () => {
		// The neutral defaults (Anyone / Anything / Just talk) carry the broad latitude the old
		// automatic sentinel used to; vibe/depth/controversy default to concrete values.
		const prompt = buildSparkPrompt(resolveGenerationParams({ type: 'random' }));

		expect(prompt).toContain('work across relationship types');
		expect(prompt).toContain('choose an accessible topic territory');
		expect(prompt).toContain('invite an engaging response');
		expect(prompt).toContain('Vibe: Thoughtful');
		// No automatic depth/controversy branch remains — those are always concrete.
		expect(prompt).not.toContain('choose a broadly accessible, low-risk level');
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

	it('suppresses sensitive topics below the Spicy safety threshold', () => {
		const prompt = buildSparkPrompt(
			resolveGenerationParams({
				type: 'random',
				depth_and_safety: { depth_level: 3, controversy_level: 1 },
				sensitive_topics: ['sex', 'religion'],
			})
		);

		expect(prompt).toContain('below the sensitive-topic threshold');
		expect(prompt).toContain('low-key and uncontroversial');
		expect(prompt).not.toContain('in-bounds — engage directly');
		expect(prompt).not.toContain('steer clear of it'); // no forced split below the gate
	});

	it('brings selected sensitive topics in-bounds at Spicy and above', () => {
		const prompt = buildSparkPrompt(
			resolveGenerationParams({
				type: 'random',
				depth_and_safety: { depth_level: 3, controversy_level: 2 },
				sensitive_topics: ['religion', 'politics'],
			})
		);

		expect(prompt).toContain('religion and politics are in-bounds');
		expect(prompt).toContain('scales with the safety level');
		expect(prompt).not.toContain('At this intensity'); // controversy 2 is below high-intensity
	});

	it('requires a sensitive/non-sensitive split at Spicy and above', () => {
		const spicy = buildSparkPrompt(
			resolveGenerationParams({
				type: 'random',
				depth_and_safety: { depth_level: 3, controversy_level: 2 },
			})
		);
		const mild = buildSparkPrompt(
			resolveGenerationParams({
				type: 'random',
				depth_and_safety: { depth_level: 3, controversy_level: 1 },
			})
		);

		expect(spicy).toContain('exactly one must engage sensitive territory head-on');
		expect(spicy).toContain('exactly one must deliberately steer clear');
		expect(mild).not.toContain('exactly one must engage sensitive territory head-on');
	});

	it('states the absolute safety floor in every prompt', () => {
		const prompt = buildSparkPrompt(
			resolveGenerationParams({
				type: 'random',
				depth_and_safety: { depth_level: 5, controversy_level: 5 },
			})
		);

		expect(prompt).toContain('no explicit sexual detail');
		expect(prompt).toContain('no instructions for illegal or dangerous acts');
	});

	it('encourages sensitive territory in general at high intensity', () => {
		const depthPrompt = buildSparkPrompt(
			resolveGenerationParams({
				type: 'random',
				depth_and_safety: { depth_level: 4, controversy_level: 2 },
			})
		);
		const controversyPrompt = buildSparkPrompt(
			resolveGenerationParams({
				type: 'random',
				depth_and_safety: { depth_level: 3, controversy_level: 4 },
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

	it('identifies the calibrated prompt as version 6', () => {
		expect(GENERATION_PROMPT_VERSION).toBe('v6');
	});
});
