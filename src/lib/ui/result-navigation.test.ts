import { describe, expect, it, vi } from 'vitest';
import { isBelowViewport, isOutsideViewport, scrollResultIntoView } from './result-navigation';

function elementWithRect(top: number, bottom: number) {
	return {
		getBoundingClientRect: () => ({ top, bottom }),
		scrollIntoView: vi.fn(),
	} as unknown as HTMLElement;
}

describe('result navigation', () => {
	it('scrolls only when the stage begins below the viewport', () => {
		expect(isBelowViewport(elementWithRect(801, 900), 800)).toBe(true);
		expect(isBelowViewport(elementWithRect(700, 900), 800)).toBe(false);
	});

	it('detects fully off-screen results', () => {
		expect(isOutsideViewport(elementWithRect(-100, -1), 800)).toBe(true);
		expect(isOutsideViewport(elementWithRect(801, 900), 800)).toBe(true);
		expect(isOutsideViewport(elementWithRect(200, 400), 800)).toBe(false);
	});

	it('uses instant positioning for reduced motion', () => {
		const element = elementWithRect(801, 900);
		scrollResultIntoView(element, true);
		expect(element.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
	});
});
