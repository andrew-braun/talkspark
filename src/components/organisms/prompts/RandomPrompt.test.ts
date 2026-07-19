import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { generatedSparks } from 'stores/sparks.svelte';
import { loadingState } from 'stores/loading.svelte';
import RandomPrompt from './RandomPrompt.svelte';

const { generateSparks } = vi.hoisted(() => ({ generateSparks: vi.fn() }));
vi.mock('$lib/generate.remote', () => ({ generateSparks }));
vi.mock('$lib/followups.remote', () => ({ generateFollowups: vi.fn() }));
vi.mock('lib/assets/icons/copy.svg?component', () => ({ default: () => {} }));
vi.mock('lib/assets/icons/BiBookmarkHeart.svg?component', () => ({ default: () => {} }));
vi.mock('lib/assets/icons/BiBookmarkHeartFill.svg?component', () => ({ default: () => {} }));

beforeEach(() => {
	generatedSparks.clear();
	generateSparks.mockReset();
	loadingState.isLoading = false;
});

afterEach(() => {
	vi.useRealTimers();
	vi.restoreAllMocks();
	cleanup();
});

// Lets the mocked remote promise and the component's await chain settle
// without relying on real timers.
async function flushMicrotasks() {
	for (let i = 0; i < 5; i++) await Promise.resolve();
	flushSync();
}

describe('RandomPrompt', () => {
	it('renders generation controls without an active generation status', () => {
		render(RandomPrompt);

		expect(screen.getByRole('button', { name: 'Customize' })).toBeVisible();
		const generateButton = screen.getByRole('button', { name: 'Random Sparks' });
		expect(generateButton).toBeVisible();
		expect(
			screen.queryByText(/Sparking\.\.\.|Three new sparks are ready|Could not make sparks/)
		).not.toBeInTheDocument();
		expect(generateButton.parentElement).toHaveClass('generation-trigger');
	});

	it('withholds a fast batch until the reveal while keeping existing cards visible', async () => {
		// Fake only the timeout that implements the minimum loading stage;
		// faking rAF/microtask scheduling would stall Svelte's internal flushing.
		vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
		vi.spyOn(performance, 'now').mockReturnValue(0);
		generatedSparks.add([{ id: 'old-1', content: 'Old card', created_at: 1 }]);
		generateSparks.mockResolvedValue({
			sparks: [{ id: 'fresh-1', content: 'Fresh card', created_at: 2 }],
		});
		render(RandomPrompt);

		await fireEvent.click(screen.getByRole('button', { name: 'Random Sparks' }));
		await flushMicrotasks();

		// The remote already resolved and wrote the store, but the minimum
		// loading stage has not elapsed: only pre-existing cards may show.
		expect(screen.getByText('Old card')).toBeInTheDocument();
		expect(screen.queryByText('Fresh card')).not.toBeInTheDocument();

		await vi.advanceTimersByTimeAsync(1949);
		await flushMicrotasks();
		expect(screen.queryByText('Fresh card')).not.toBeInTheDocument();

		await vi.advanceTimersByTimeAsync(1);
		await flushMicrotasks();

		expect(screen.getByText('Fresh card')).toBeInTheDocument();
		expect(document.getElementById('spark-fresh-1')).toHaveAttribute('data-fresh', 'true');
		expect(screen.getByText('Old card')).toBeInTheDocument();
	});

	it('shows the error stage with existing cards intact when generation fails', async () => {
		generatedSparks.add([{ id: 'old-1', content: 'Old card', created_at: 1 }]);
		generateSparks.mockRejectedValue(new Error('offline'));
		render(RandomPrompt);

		await fireEvent.click(screen.getByRole('button', { name: 'Random Sparks' }));
		await flushMicrotasks();

		expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
		expect(screen.getByText('Old card')).toBeInTheDocument();
	});
});
