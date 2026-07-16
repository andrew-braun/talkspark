import { describe, expect, it } from 'vitest';
import { DEFAULT_LEVER_VALUE, type GenerationParams } from 'ts/params';
import {
	DEFAULT_GENERATION_PARAMS,
	LEVER_FIELDS,
	activeLeverCount,
	isLeverSet,
} from './generation-options';

describe('isLeverSet', () => {
	it('treats the sentinel as unset and concrete values as set', () => {
		expect(isLeverSet(DEFAULT_LEVER_VALUE)).toBe(false);
		expect(isLeverSet('warm')).toBe(true);
		expect(isLeverSet(0)).toBe(true);
	});

	it('treats a multi-select as set only when anything is selected', () => {
		expect(isLeverSet([])).toBe(false);
		expect(isLeverSet(['sex'])).toBe(true);
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

	it('maps the reset-all sentinel to an empty selection', () => {
		const params: GenerationParams = { type: 'random', sensitive_topics: ['sex'] };
		field.set(params, DEFAULT_LEVER_VALUE);
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
