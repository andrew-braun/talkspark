import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BookmarkButton from './BookmarkButton.svelte';
import { savedSparks } from 'stores/sparks.svelte';
import type { SparkData } from 'ts/sparks';

vi.mock('lib/assets/icons/BiBookmarkHeart.svg?component', () => ({ default: () => {} }));
vi.mock('lib/assets/icons/BiBookmarkHeartFill.svg?component', () => ({ default: () => {} }));

afterEach(() => {
	cleanup();
	savedSparks.clear();
});

const spark: SparkData = { id: 'spark-1', content: 'A question', created_at: 1 };

describe('BookmarkButton', () => {
	it('exposes and toggles the pressed state', async () => {
		savedSparks.clear();
		render(BookmarkButton, { props: { spark } });

		const button = screen.getByRole('button', { name: 'Save this spark' });
		expect(button).toHaveAttribute('aria-pressed', 'false');
		expect(button).not.toHaveClass('active');

		await fireEvent.click(button);

		expect(button).toHaveAttribute('aria-pressed', 'true');
		expect(button).toHaveClass('active');
	});

	it('unsaves an already-saved spark', async () => {
		savedSparks.add([spark]);
		render(BookmarkButton, { props: { spark } });

		const button = screen.getByRole('button', { name: 'Save this spark' });
		expect(button).toHaveAttribute('aria-pressed', 'true');

		await fireEvent.click(button);

		expect(button).toHaveAttribute('aria-pressed', 'false');
		expect(savedSparks.items).toHaveLength(0);
	});
});
