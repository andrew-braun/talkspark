import { describe, expect, it } from 'vitest';
import {
	buildFollowupCritiquePrompt,
	FOLLOWUP_CRITIQUE_SYSTEM_INSTRUCTION,
} from './followup-critique-prompt';
import type { Followup } from 'ts/followup';
import type { Spark } from 'ts/spark';

const parent: Spark = {
	id: 'spark-1',
	content: 'What made you smile this week?',
	created_at: 1,
};

const followup: Followup = {
	id: 'followup-1',
	parent_id: 'spark-1',
	content: 'What detail do you still remember?',
	depth_delta: 1,
	skill: 'follow_up',
	created_at: 2,
};

describe('buildFollowupCritiquePrompt', () => {
	it('references parent content and deepening criteria', () => {
		const prompt = buildFollowupCritiquePrompt(followup, parent);

		expect(prompt).toContain(parent.content);
		expect(prompt).toContain(followup.content);
		expect(prompt).toContain('deepens without interrogating');
		expect(FOLLOWUP_CRITIQUE_SYSTEM_INSTRUCTION).toContain(
			'Merely restating a parent classification does not demonstrate context fit'
		);
	});
});
