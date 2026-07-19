import { readFileSync } from 'node:fs';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SparkGenerationStage from './SparkGenerationStage.svelte';

const componentSource = readFileSync(
	'src/components/organisms/sparks/SparkGenerationStage.svelte',
	'utf8'
);

const fakeCards: HTMLElement[] = [];

afterEach(() => {
	fakeCards.forEach((card) => card.remove());
	fakeCards.length = 0;
	vi.restoreAllMocks();
	cleanup();
});

function appendTarget(id: string, rect: DOMRect) {
	const target = document.createElement('div');
	target.id = `spark-target-${id}`;
	vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect);
	document.body.append(target);
	fakeCards.push(target);
	return target;
}

describe('SparkGenerationStage', () => {
	it('renders no padded status content while idle', () => {
		const { container } = render(SparkGenerationStage, { props: { phase: 'idle' } });
		const stage = container.querySelector('.generation-stage')!;

		expect(stage.children).toHaveLength(0);
		expect(screen.queryByRole('status')).not.toBeInTheDocument();
	});

	it('announces and renders the pulsing source during loading', () => {
		render(SparkGenerationStage, { props: { phase: 'loading' } });
		expect(screen.getByRole('status')).toHaveTextContent('Sparking...');
		expect(screen.getByTestId('source-spark')).toHaveClass('starburst');
	});

	it('positions all three decorative seeds from the rendered fresh cards', async () => {
		const article = document.createElement('article');
		article.id = 'spark-one';
		const articleRect = vi.spyOn(article, 'getBoundingClientRect');
		document.body.append(article);
		fakeCards.push(article);
		const firstTarget = appendTarget('one', new DOMRect(200, 500, 400, 100));
		appendTarget('two', new DOMRect(240, 640, 360, 120));
		appendTarget('three', new DOMRect(180, 800, 440, 80));
		const onRevealReady = vi.fn();
		const { container } = render(SparkGenerationStage, {
			props: {
				phase: 'revealing',
				freshSparkIds: ['one', 'two', 'three'],
				onRevealReady,
			},
		});
		const stage = container.querySelector('.generation-stage')!;
		vi.spyOn(stage, 'getBoundingClientRect').mockReturnValue(new DOMRect(100, 200, 400, 240));

		await waitFor(() => expect(screen.getAllByTestId('split-seed')).toHaveLength(3));
		const seeds = screen.getAllByTestId('split-seed');
		expect(seeds).toHaveLength(3);
		expect(seeds[0]).toHaveClass('seed-upper');
		expect(seeds[1]).toHaveClass('seed-middle');
		expect(seeds[2]).toHaveClass('seed-lower');
		expect(Number.parseFloat(seeds[0].style.getPropertyValue('--seed-x'))).toBeCloseTo(200);
		expect(Number.parseFloat(seeds[0].style.getPropertyValue('--seed-y'))).toBeCloseTo(201.2);
		expect(firstTarget.getBoundingClientRect).toHaveBeenCalled();
		expect(articleRect).not.toHaveBeenCalled();
		expect(onRevealReady).toHaveBeenCalledOnce();
	});

	it('releases pending cards without seeds when any target is missing', async () => {
		const onRevealReady = vi.fn();
		render(SparkGenerationStage, {
			props: {
				phase: 'revealing',
				freshSparkIds: ['missing-1', 'missing-2', 'missing-3'],
				onRevealReady,
			},
		});

		await waitFor(() => expect(onRevealReady).toHaveBeenCalledOnce());

		expect(screen.queryAllByTestId('split-seed')).toHaveLength(0);
	});

	it('cancels pending target measurement when reveal ends', async () => {
		appendTarget('one', new DOMRect(200, 500, 400, 100));
		appendTarget('two', new DOMRect(240, 640, 360, 120));
		appendTarget('three', new DOMRect(180, 800, 440, 80));
		const onRevealReady = vi.fn();
		const { rerender } = render(SparkGenerationStage, {
			props: {
				phase: 'revealing',
				freshSparkIds: ['one', 'two', 'three'],
				onRevealReady,
			},
		});

		await rerender({ phase: 'idle', freshSparkIds: ['one', 'two', 'three'] });
		await tick();

		expect(screen.queryAllByTestId('split-seed')).toHaveLength(0);
		expect(onRevealReady).not.toHaveBeenCalled();
	});

	it('cancels stale work when fresh IDs are replaced with another same-length batch', async () => {
		appendTarget('old-one', new DOMRect(200, 500, 400, 100));
		appendTarget('new-one', new DOMRect(300, 700, 400, 100));
		const onRevealReady = vi.fn();
		const { container, rerender } = render(SparkGenerationStage, {
			props: { phase: 'revealing', freshSparkIds: ['old-one'], onRevealReady },
		});
		const stage = container.querySelector('.generation-stage')!;
		vi.spyOn(stage, 'getBoundingClientRect').mockReturnValue(new DOMRect(100, 200, 400, 240));

		await rerender({
			phase: 'revealing',
			freshSparkIds: ['new-one'],
			onRevealReady,
		});
		await waitFor(() => expect(screen.getAllByTestId('split-seed')).toHaveLength(1));

		const seed = screen.getByTestId('split-seed');
		expect(Number.parseFloat(seed.style.getPropertyValue('--seed-x'))).toBeCloseTo(300);
		expect(Number.parseFloat(seed.style.getPropertyValue('--seed-y'))).toBeCloseTo(401.2);
		expect(onRevealReady).toHaveBeenCalledOnce();
	});

	it('pins status above the motion anchor without reserving stage flow space', () => {
		const compactSource = componentSource.replace(/\s+/g, ' ');

		expect(compactSource).toContain(
			'class:motion-active={phase === \u0027loading\u0027 || phase === \u0027revealing\u0027}'
		);
		expect(compactSource).toContain(
			'&.motion-active { .live-status { position: absolute; top: 0;'
		);
		expect(compactSource).not.toContain('min-height: calc(var(--spacing-xxl) * 6)');
	});

	it('establishes active stage height without interpolating min-height', () => {
		const compactSource = componentSource.replace(/\s+/g, ' ');

		expect(compactSource).not.toMatch(
			/transition(?:-property)?:\s*[^;}]*\b(?:all|min-height)\b/
		);
	});

	it('overlays every active phase while visually hiding only the reveal status', () => {
		const { container } = render(SparkGenerationStage, {
			props: { phase: 'revealing', freshSparkIds: ['missing'] },
		});
		const stage = container.querySelector('.generation-stage')!;
		const compactSource = componentSource.replace(/\s+/g, ' ');

		expect(stage).toHaveClass('active', 'revealing');
		expect(compactSource).toContain(
			'&.active { position: absolute; inset: 0; z-index: 1; overflow: visible; pointer-events: none;'
		);
		expect(compactSource).toContain(
			'&.revealing { .live-status { width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip-path: inset(50%);'
		);
		expect(compactSource).toContain('.retry, .jump { z-index: 2; pointer-events: auto;');
	});

	it('offers an actionable retry in the reserved stage', async () => {
		const onRetry = vi.fn();
		render(SparkGenerationStage, {
			props: { phase: 'error', errorMessage: 'Could not make sparks.', onRetry },
		});
		expect(screen.getByRole('status')).toHaveTextContent('Could not make sparks.');
		await fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
		expect(onRetry).toHaveBeenCalledOnce();
	});
});
