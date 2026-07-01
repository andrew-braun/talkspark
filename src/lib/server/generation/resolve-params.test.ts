import { describe, expect, it } from 'vitest';
import { DEFAULT_GENERATION_PARAMS } from 'lib/data/generation-options';
import { resolveGenerationParams } from './resolve-params';

describe('resolveGenerationParams', () => {
	it('returns defaults when params are empty except type', () => {
		const resolved = resolveGenerationParams({ type: 'random' });

		expect(resolved).toEqual(DEFAULT_GENERATION_PARAMS);
	});

	it('merges partial lever overrides with defaults', () => {
		const resolved = resolveGenerationParams({
			type: 'random',
			vibe: 'weird',
			depth_and_safety: { depth_level: 4, controversy_level: 2 },
		});

		expect(resolved.vibe).toBe('weird');
		expect(resolved.relationship_context).toBe('close_friend');
		expect(resolved.depth_and_safety).toEqual({ depth_level: 4, controversy_level: 2 });
	});

	it('preserves a fully specified params object', () => {
		const resolved = resolveGenerationParams({
			type: 'random',
			relationship_context: 'stranger',
			setting: 'party',
			conversation_goal: 'debate',
			vibe: 'thoughtful',
			depth_and_safety: { depth_level: 3, controversy_level: 4 },
		});

		expect(resolved).toEqual({
			type: 'random',
			relationship_context: 'stranger',
			setting: 'party',
			conversation_goal: 'debate',
			vibe: 'thoughtful',
			depth_and_safety: { depth_level: 3, controversy_level: 4 },
		});
	});
});
