export type GenerationPhase = 'idle' | 'loading' | 'revealing' | 'error';

export function isBelowViewport(element: HTMLElement, viewportHeight = window.innerHeight) {
	return element.getBoundingClientRect().top >= viewportHeight;
}

export function isOutsideViewport(element: HTMLElement, viewportHeight = window.innerHeight) {
	const { top, bottom } = element.getBoundingClientRect();
	return bottom <= 0 || top >= viewportHeight;
}

export function scrollResultIntoView(element: HTMLElement, reducedMotion: boolean) {
	element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
}
