import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { generatedSparks } from 'stores/sparks.svelte';
import GenerateSparksButton from './GenerateSparksButton.svelte';

const { generateSparks } = vi.hoisted(() => ({ generateSparks: vi.fn() }));
vi.mock('$lib/generate.remote', () => ({ generateSparks }));

const spark = {
	id: 'spark-1',
	content: 'What changed your mind?',
	created_at: 1,
};

beforeEach(() => {
	generatedSparks.clear();
	generateSparks.mockReset();
});

afterEach(cleanup);

describe('GenerateSparksButton', () => {
	it('reports start and success around the store write', async () => {
		generateSparks.mockResolvedValue({ sparks: [spark] });
		const onGenerateStart = vi.fn();
		const onGenerated = vi.fn();
		render(GenerateSparksButton, { props: { onGenerateStart, onGenerated } });

		await fireEvent.click(screen.getByRole('button', { name: 'Random Sparks' }));

		expect(onGenerateStart).toHaveBeenCalledOnce();
		await waitFor(() => expect(onGenerated).toHaveBeenCalledWith([spark]));
		expect(generatedSparks.items).toContainEqual(spark);
	});

	it('reports failure without adding sparks', async () => {
		const error = new Error('offline');
		generateSparks.mockRejectedValue(error);
		const onGenerateError = vi.fn();
		render(GenerateSparksButton, { props: { onGenerateError } });

		await fireEvent.click(screen.getByRole('button', { name: 'Random Sparks' }));

		await waitFor(() => expect(onGenerateError).toHaveBeenCalledWith(error));
		expect(generatedSparks.items).toHaveLength(0);
	});

	it('exports the same generation action for retry', async () => {
		generateSparks.mockResolvedValue({ sparks: [spark] });
		const view = render(GenerateSparksButton);

		await view.component.generate();

		expect(generateSparks).toHaveBeenCalledOnce();
	});
});
