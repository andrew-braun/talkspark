import '@testing-library/jest-dom/vitest';

globalThis.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};

// jsdom has no Web Animations API; Svelte transitions call element.animate().
if (!Element.prototype.animate) {
	Element.prototype.animate = () =>
		({
			cancel() {},
			finish() {},
			pause() {},
			play() {},
			finished: Promise.resolve(),
			onfinish: null,
		}) as unknown as Animation;
}

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	}),
});

HTMLElement.prototype.scrollIntoView = () => {};
