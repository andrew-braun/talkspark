import { describe, expect, it } from 'vitest';
import { sortByDate } from './sort';

describe('sortByDate', () => {
	it('sorts objects by date field descending', () => {
		const objects = [
			{ id: 'a', created_at: 100 },
			{ id: 'b', created_at: 300 },
			{ id: 'c', created_at: 200 },
		];

		const sorted = sortByDate({
			objects,
			dateField: 'created_at',
			direction: 'DESC',
		});

		expect(sorted.map((item) => item.id)).toEqual(['b', 'c', 'a']);
	});

	it('sorts objects by date field ascending', () => {
		const objects = [
			{ id: 'a', created_at: 100 },
			{ id: 'b', created_at: 300 },
			{ id: 'c', created_at: 200 },
		];

		const sorted = sortByDate({
			objects,
			dateField: 'created_at',
			direction: 'ASC',
		});

		expect(sorted.map((item) => item.id)).toEqual(['a', 'c', 'b']);
	});

	it('does not mutate the original array', () => {
		const objects = [{ id: 'a', created_at: 1 }];
		const copy = [...objects];

		sortByDate({ objects, dateField: 'created_at', direction: 'DESC' });

		expect(objects).toEqual(copy);
	});
});
