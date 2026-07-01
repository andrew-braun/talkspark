import { describe, expect, it } from 'vitest';
import { GENERATION_PROMPT_VERSION } from 'lib/server/api/llm/prompts/spark-prompt';
import type { GeneratedSpark } from 'lib/server/api/llm/schemas/spark.schema';
import { DEFAULT_GENERATION_PARAMS } from 'lib/data/generation-options';
import { resolveGenerationParams } from './resolve-params';
import { enrichSpark } from './enrich-spark';

const sampleGenerated: GeneratedSpark = {
	content: 'What small moment made you smile this week?',
	spark_variant: 'primary',
	relationship_context: 'stranger',
	setting: 'party',
	conversation_goal: 'laugh',
	conversation_motive: 'play',
	vibe: 'weird',
	depth_level: 5,
	controversy_level: 4,
	humor_level: 3,
	answer_shape: 'story',
	reciprocity_mode: 'everyone_answers',
	follow_up_potential: 4,
	conversation_skill: 'follow_up',
	seed_follow_up: 'What detail do you still remember from that moment?',
};

describe('enrichSpark', () => {
	it('stamps server-authoritative fields and metadata', () => {
		const resolved = resolveGenerationParams(DEFAULT_GENERATION_PARAMS);
		const spark = enrichSpark(sampleGenerated, resolved, {
			id: 'spark-1',
			now: 1_700_000_000_000,
		});

		expect(spark.id).toBe('spark-1');
		expect(spark.created_at).toBe(1_700_000_000_000);
		expect(spark.updated_at).toBe(1_700_000_000_000);
		expect(spark.status).toBe('draft');
		expect(spark.source_type).toBe('ai_generated');
		expect(spark.visibility).toBe('private');
		expect(spark.metadata).toEqual({
			generation_prompt_version: GENERATION_PROMPT_VERSION,
			generation_params: resolved,
			seed_follow_up: sampleGenerated.seed_follow_up,
			spark_variant: 'primary',
		});
	});

	it('overrides lever fields from resolved params, not model output', () => {
		const resolved = resolveGenerationParams({
			type: 'random',
			relationship_context: 'coworker',
			setting: 'meeting',
			conversation_goal: 'brainstorm',
			vibe: 'thoughtful',
			depth_and_safety: { depth_level: 2, controversy_level: 1 },
		});

		const spark = enrichSpark(sampleGenerated, resolved, {
			id: 'spark-2',
			now: 1_700_000_000_001,
		});

		expect(spark.relationship_context).toBe('coworker');
		expect(spark.setting).toBe('meeting');
		expect(spark.conversation_goal).toBe('brainstorm');
		expect(spark.vibe).toBe('thoughtful');
		expect(spark.depth_level).toBe(2);
		expect(spark.controversy_level).toBe(1);
	});

	it('keeps model-classified fields from generated output', () => {
		const resolved = resolveGenerationParams(DEFAULT_GENERATION_PARAMS);
		const spark = enrichSpark(sampleGenerated, resolved, {
			id: 'spark-3',
			now: 1_700_000_000_002,
		});

		expect(spark.content).toBe(sampleGenerated.content);
		expect(spark.conversation_motive).toBe('play');
		expect(spark.humor_level).toBe(3);
		expect(spark.answer_shape).toBe('story');
		expect(spark.reciprocity_mode).toBe('everyone_answers');
		expect(spark.follow_up_potential).toBe(4);
		expect(spark.conversation_skill).toBe('follow_up');
	});
});
