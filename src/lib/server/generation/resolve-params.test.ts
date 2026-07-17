import { describe, expect, it } from 'vitest';
import { DEFAULT_GENERATION_PARAMS } from 'lib/data/generation-options';
import type { GenerationParams } from 'ts/params';
import { resolveGenerationParams } from './resolve-params';

describe('resolveGenerationParams', () => {
	it('returns the shipped defaults when params only specify type', () => {
		expect(resolveGenerationParams({ type: 'random' })).toEqual(DEFAULT_GENERATION_PARAMS);
	});

	it('fills unspecified levers with their concrete defaults', () => {
		const resolved = resolveGenerationParams({
			type: 'random',
			topic_lens: 'stories_memories',
			vibe: 'nostalgic',
			depth_and_safety: { depth_level: 4, controversy_level: 5 },
		});

		expect(resolved.relationship_context).toBe('anyone');
		expect(resolved.topic_lens).toBe('stories_memories');
		expect(resolved.conversation_goal).toBe('just_talk');
		expect(resolved.vibe).toBe('nostalgic');
		expect(resolved.depth_and_safety).toEqual({
			depth_level: 4,
			controversy_level: 5,
		});
		// Unspecified sensitive_topics fall back to the All-topics default.
		expect(resolved.sensitive_topics).toEqual(DEFAULT_GENERATION_PARAMS.sensitive_topics);
	});

	it('preserves a fully specified params object without a setting', () => {
		const params: GenerationParams = {
			type: 'random',
			relationship_context: 'stranger',
			topic_lens: 'ideas_perspectives',
			conversation_goal: 'debate',
			vibe: 'thoughtful',
			depth_and_safety: { depth_level: 3, controversy_level: 4 },
			sensitive_topics: ['sex', 'money'],
		};

		expect(resolveGenerationParams(params)).toEqual(params);
	});

	it('copies the sensitive topics array instead of aliasing it', () => {
		const topics: GenerationParams['sensitive_topics'] = ['religion'];
		const resolved = resolveGenerationParams({ type: 'random', sensitive_topics: topics });

		expect(resolved.sensitive_topics).toEqual(['religion']);
		expect(resolved.sensitive_topics).not.toBe(topics);
	});
});
