import { describe, expect, it } from 'vitest';
import { computeCritiquePassed, toCritiqueResult } from './critique';
import type { GeneratedCritique } from 'lib/server/api/llm/schemas/critique.schema';

describe('computeCritiquePassed', () => {
	it('passes when all gates are at least 4', () => {
		expect(
			computeCritiquePassed({
				clarity: 4,
				answerability: 5,
				context_fit: 4,
				safety: 4,
			})
		).toBe(true);
	});

	it('fails when any gate is below 4', () => {
		expect(
			computeCritiquePassed({
				clarity: 4,
				answerability: 3,
				context_fit: 5,
				safety: 4,
			})
		).toBe(false);
	});
});

describe('toCritiqueResult', () => {
	it('maps generated scores and omits empty rewrites', () => {
		const generated: GeneratedCritique = {
			clarity: 5,
			answerability: 4,
			context_fit: 4,
			safety: 4,
			flags: ['generic_wording'],
			suggested_rewrite: '   ',
		};

		expect(toCritiqueResult(generated)).toEqual({
			scores: {
				clarity: 5,
				answerability: 4,
				context_fit: 4,
				safety: 4,
			},
			passed: true,
			flags: ['generic_wording'],
		});
	});

	it('keeps a non-empty suggested rewrite', () => {
		const generated: GeneratedCritique = {
			clarity: 3,
			answerability: 4,
			context_fit: 4,
			safety: 4,
			flags: [],
			suggested_rewrite: 'What small detail stood out to you?',
		};

		expect(toCritiqueResult(generated)).toEqual({
			scores: {
				clarity: 3,
				answerability: 4,
				context_fit: 4,
				safety: 4,
			},
			passed: false,
			flags: [],
			suggested_rewrite: 'What small detail stood out to you?',
		});
	});
});
