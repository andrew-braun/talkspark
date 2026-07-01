import { describe, expect, it } from 'vitest';
import { computeCritiquePassed, mapBatchCritiquesToSparks, toCritiqueResult } from './critique';
import type {
	GeneratedBatchCritiqueItem,
	GeneratedCritique,
} from 'lib/server/api/llm/schemas/critique.schema';
import type { Spark } from 'ts/spark';

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

describe('mapBatchCritiquesToSparks', () => {
	const sparks: Spark[] = [
		{
			id: '1',
			content: 'Primary spark',
			created_at: 1,
			metadata: { spark_variant: 'primary' },
		},
		{
			id: '2',
			content: 'Contrast spark',
			created_at: 2,
			metadata: { spark_variant: 'contrast' },
		},
		{
			id: '3',
			content: 'Playful spark',
			created_at: 3,
			metadata: { spark_variant: 'playful_weird' },
		},
	];

	const items: GeneratedBatchCritiqueItem[] = [
		{
			spark_variant: 'playful_weird',
			clarity: 3,
			answerability: 4,
			context_fit: 4,
			safety: 5,
			flags: [],
			suggested_rewrite: '',
		},
		{
			spark_variant: 'primary',
			clarity: 5,
			answerability: 5,
			context_fit: 5,
			safety: 5,
			flags: [],
			suggested_rewrite: '',
		},
		{
			spark_variant: 'contrast',
			clarity: 4,
			answerability: 4,
			context_fit: 4,
			safety: 4,
			flags: ['generic_wording'],
			suggested_rewrite: '',
		},
	];

	it('aligns critiques to sparks by spark_variant, not response order', () => {
		const results = mapBatchCritiquesToSparks(sparks, items);

		expect(results[0].passed).toBe(true);
		expect(results[0].scores.clarity).toBe(5);
		expect(results[1].flags).toEqual(['generic_wording']);
		expect(results[2].passed).toBe(false);
	});

	it('throws when a spark variant is missing from the batch response', () => {
		expect(() =>
			mapBatchCritiquesToSparks(
				sparks,
				items.filter((item) => item.spark_variant !== 'primary')
			)
		).toThrow('No critique returned for spark_variant "primary"');
	});
});
