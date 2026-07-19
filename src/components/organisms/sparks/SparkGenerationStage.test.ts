import { readFileSync } from 'node:fs';
import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SparkGenerationStage from './SparkGenerationStage.svelte';

const componentSource = readFileSync(
	'src/components/organisms/sparks/SparkGenerationStage.svelte',
	'utf8'
);

afterEach(cleanup);

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

	it('renders three decorative seeds during reveal', () => {
		render(SparkGenerationStage, {
			props: { phase: 'revealing', freshSparkIds: ['one', 'two', 'three'] },
		});
		const seeds = screen.getAllByTestId('split-seed');
		expect(seeds).toHaveLength(3);
		expect(seeds[0]).toHaveClass('seed-upper');
		expect(seeds[1]).toHaveClass('seed-middle');
		expect(seeds[2]).toHaveClass('seed-lower');
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
