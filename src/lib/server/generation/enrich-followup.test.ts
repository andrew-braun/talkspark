import { describe, expect, it } from 'vitest';
import { enrichFollowup } from './enrich-followup';
import type { GeneratedFollowup } from 'lib/server/api/llm/schemas/followup.schema';

const generated: GeneratedFollowup = {
	content: 'What detail do you still remember?',
	depth_delta: 2,
	skill: 'follow_up',
};

describe('enrichFollowup', () => {
	it('stamps server-authoritative fields', () => {
		const followup = enrichFollowup(generated, 'parent-1', 1, {
			id: 'followup-1',
			now: 1_700_000_000_000,
		});

		expect(followup).toEqual({
			id: 'followup-1',
			parent_id: 'parent-1',
			content: generated.content,
			depth_delta: 2,
			position: 1,
			skill: 'follow_up',
			created_at: 1_700_000_000_000,
			metadata: {
				generation_prompt_version: 'v1',
			},
		});
	});
});
