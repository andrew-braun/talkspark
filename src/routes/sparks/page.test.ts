import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { generatedSparks, savedSparks } from 'stores/sparks.svelte';
import SparksPage from './+page.svelte';

const { generateSparks } = vi.hoisted(() => ({ generateSparks: vi.fn() }));
vi.mock('$lib/generate.remote', () => ({ generateSparks }));

const { goto } = vi.hoisted(() => ({ goto: vi.fn() }));
vi.mock('$app/navigation', () => ({ goto }));
vi.mock('$app/paths', () => ({ resolve: (path: string) => path }));
vi.mock('$app/state', () => ({ page: { data: { pathname: '/sparks' } } }));

vi.mock('$lib/followups.remote', () => ({ generateFollowups: vi.fn() }));
vi.mock('lib/assets/icons/copy.svg?component', () => ({ default: () => {} }));
vi.mock('lib/assets/icons/BiBookmarkHeart.svg?component', () => ({ default: () => {} }));
vi.mock('lib/assets/icons/BiBookmarkHeartFill.svg?component', () => ({ default: () => {} }));

const savedSpark = { id: 'saved-1', content: 'A question I saved', created_at: 1 };

beforeEach(() => {
	generatedSparks.clear();
	savedSparks.clear();
	savedSparks.add([savedSpark]);
	generateSparks.mockReset();
	goto.mockReset();
});

afterEach(cleanup);

describe('/sparks page', () => {
	it('shows an accessible error and keeps saved cards when generation fails', async () => {
		generateSparks.mockRejectedValue(new Error('offline'));
		render(SparksPage);

		await fireEvent.click(screen.getByRole('button', { name: 'More Random Sparks' }));

		const alert = await screen.findByRole('alert');
		expect(alert).toBeVisible();
		expect(alert).toHaveTextContent('Could not make sparks.');
		expect(screen.getByText('A question I saved')).toBeInTheDocument();
		expect(goto).not.toHaveBeenCalled();
	});

	it('clears a stale error on the next attempt and still navigates home on success', async () => {
		generateSparks.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({
			sparks: [{ id: 'new-1', content: 'A brand new question', created_at: 2 }],
		});
		render(SparksPage);

		await fireEvent.click(screen.getByRole('button', { name: 'More Random Sparks' }));
		await screen.findByRole('alert');

		await fireEvent.click(screen.getByRole('button', { name: 'More Random Sparks' }));

		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
		await waitFor(() => expect(goto).toHaveBeenCalledWith('/'));
		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	});
});
