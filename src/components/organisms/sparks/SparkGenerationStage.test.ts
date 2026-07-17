import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SparkGenerationStage from './SparkGenerationStage.svelte';

afterEach(cleanup);

describe('SparkGenerationStage', () => {
	it('announces and renders the pulsing source during loading', () => {
		render(SparkGenerationStage, { props: { phase: 'loading' } });
		expect(screen.getByRole('status')).toHaveTextContent('Making three sparks…');
		expect(screen.getByTestId('source-spark')).toBeInTheDocument();
	});

	it('renders three decorative seeds during reveal', () => {
		render(SparkGenerationStage, {
			props: { phase: 'revealing', freshSparkIds: ['one', 'two', 'three'] },
		});
		expect(screen.getAllByTestId('split-seed')).toHaveLength(3);
	});

	it('offers an actionable retry in the reserved stage', async () => {
		const onRetry = vi.fn();
		render(SparkGenerationStage, {
			props: { phase: 'error', errorMessage: 'Could not make sparks.', onRetry },
		});
		await fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
		expect(onRetry).toHaveBeenCalledOnce();
	});
});
