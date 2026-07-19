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

function appendCard(id: string, rect: DOMRect) {
	const card = document.createElement('article');
	card.id = `spark-${id}`;
	vi.spyOn(card, 'getBoundingClientRect').mockReturnValue(rect);
	document.body.append(card);
	fakeCards.push(card);
	return card;
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
		appendCard('one', new DOMRect(200, 500, 400, 100));
		appendCard('two', new DOMRect(240, 640, 360, 120));
		appendCard('three', new DOMRect(180, 800, 440, 80));
		const { container } = render(SparkGenerationStage, {
			props: { phase: 'revealing', freshSparkIds: ['one', 'two', 'three'] },
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
	});

	it('suppresses decorative seeds when any fresh card is missing', async () => {
		render(SparkGenerationStage, {
			props: { phase: 'revealing', freshSparkIds: ['missing-1', 'missing-2', 'missing-3'] },
		});

		await tick();

		expect(screen.queryAllByTestId('split-seed')).toHaveLength(0);
	});

	it('cancels pending target measurement when reveal ends', async () => {
		appendCard('one', new DOMRect(200, 500, 400, 100));
		appendCard('two', new DOMRect(240, 640, 360, 120));
		appendCard('three', new DOMRect(180, 800, 440, 80));
		const { rerender } = render(SparkGenerationStage, {
			props: { phase: 'revealing', freshSparkIds: ['one', 'two', 'three'] },
		});

		await rerender({ phase: 'idle', freshSparkIds: ['one', 'two', 'three'] });
		await tick();

		expect(screen.queryAllByTestId('split-seed')).toHaveLength(0);
	});

	it('reserves the full split path and pins status above the motion anchor', () => {
		const compactSource = componentSource.replace(/\s+/g, ' ');

		expect(compactSource).toContain('&.active { min-height: calc(var(--spacing-xxl) * 6); }');
		expect(compactSource).toContain(
			'class:motion-active={phase === \u0027loading\u0027 || phase === \u0027revealing\u0027}'
		);
		expect(compactSource).toContain(
			'&.motion-active { .live-status { position: absolute; top: 0;'
		);
		expect(compactSource).not.toMatch(/@media \(width >= 768px\).*?&\.active \{ min-height:/s);
	});

	it('establishes active stage height without interpolating min-height', () => {
		const compactSource = componentSource.replace(/\s+/g, ' ');

		expect(compactSource).not.toMatch(
			/transition(?:-property)?:\s*[^;}]*\b(?:all|min-height)\b/
		);
	});

	it('overlays the reveal while visually hiding only its live status', () => {
		const { container } = render(SparkGenerationStage, {
			props: { phase: 'revealing', freshSparkIds: ['missing'] },
		});
		const stage = container.querySelector('.generation-stage')!;
		const compactSource = componentSource.replace(/\s+/g, ' ');

		expect(stage).toHaveClass('revealing');
		expect(compactSource).toContain(
			'&.revealing { position: absolute; inset: 0 0 auto; z-index: 1; overflow: visible; pointer-events: none;'
		);
		expect(compactSource).toContain(
			'.live-status { width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip-path: inset(50%);'
		);
		expect(compactSource).not.toContain('&.revealing { display: none;');
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
