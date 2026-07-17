import { describe, expect, it } from 'vitest';
import type { GenerationParams } from 'ts/params';
import {
	DEFAULT_GENERATION_PARAMS,
	LEVER_FIELDS,
	activeLeverCount,
	isLeverActive,
} from './generation-options';

describe('isLeverActive', () => {
	const vibeField = LEVER_FIELDS.find((field) => field.key === 'vibe')!;
	const controversyField = LEVER_FIELDS.find((field) => field.key === 'controversy_level')!;
	const sensitiveField = LEVER_FIELDS.find((field) => field.key === 'sensitive_topics')!;

	it('treats a select lever as active only when it differs from its default', () => {
		expect(isLeverActive(vibeField, 'thoughtful')).toBe(false); // Thoughtful is the default
		expect(isLeverActive(vibeField, 'warm')).toBe(true);
	});

	it('treats a scale lever as active when it differs from its concrete default', () => {
		expect(isLeverActive(controversyField, 2)).toBe(false); // Spicy is the default
		expect(isLeverActive(controversyField, 0)).toBe(true);
	});

	it('treats the sensitive multi-select as active when it differs from the All default', () => {
		const allTopics = sensitiveField.get(DEFAULT_GENERATION_PARAMS);
		expect(isLeverActive(sensitiveField, allTopics)).toBe(false);
		expect(isLeverActive(sensitiveField, ['sex'])).toBe(true);
		expect(isLeverActive(sensitiveField, [])).toBe(true);
	});
});

describe('activeLeverCount', () => {
	it('counts zero for the all-default params', () => {
		expect(activeLeverCount(DEFAULT_GENERATION_PARAMS)).toBe(0);
	});

	it('counts a non-empty multi-select lever as one', () => {
		const params: GenerationParams = {
			...DEFAULT_GENERATION_PARAMS,
			sensitive_topics: ['religion', 'politics'],
		};
		expect(activeLeverCount(params)).toBe(1);
	});
});

describe('sensitive_topics lever field', () => {
	const field = LEVER_FIELDS.find((entry) => entry.key === 'sensitive_topics')!;

	it('clears the selection when set to an empty array', () => {
		const params: GenerationParams = { type: 'random', sensitive_topics: ['sex'] };
		field.set(params, []);
		expect(params.sensitive_topics).toEqual([]);
	});

	it('copies selections instead of aliasing the incoming array', () => {
		const params: GenerationParams = { type: 'random' };
		const selection = ['death', 'money'];
		field.set(params, selection);
		expect(params.sensitive_topics).toEqual(selection);
		expect(params.sensitive_topics).not.toBe(selection);
	});
});
