import { describe, expect, it } from 'vitest';
import { getRevealTarget } from './spark-reveal-geometry';

describe('getRevealTarget', () => {
	it('targets the card vertical center and right-half landing point', () => {
		const stage = { left: 100, top: 200, width: 400, height: 240 };
		const card = { left: 200, top: 500, width: 400, height: 100 };
		const target = getRevealTarget(stage, card);

		expect(target.x).toBe(200);
		expect(target.y).toBeCloseTo(201.2);
	});
});
