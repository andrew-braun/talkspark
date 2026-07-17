import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Sparks from './Sparks.svelte';

vi.mock('$lib/followups.remote', () => ({ generateFollowups: vi.fn() }));
vi.mock('lib/assets/icons/copy.svg?component', () => ({ default: () => {} }));
vi.mock('lib/assets/icons/BiBookmarkHeart.svg?component', () => ({ default: () => {} }));
vi.mock('lib/assets/icons/BiBookmarkHeartFill.svg?component', () => ({ default: () => {} }));

afterEach(cleanup);

const sparks = [
	{ id: 'new-1', content: 'New one', created_at: 3 },
	{ id: 'old-1', content: 'Old one', created_at: 1 },
];

function animationEnd(name: string) {
	const event = new Event('animationend', { bubbles: true });
	Object.defineProperty(event, 'animationName', { value: name });
	return event;
}

describe('Sparks', () => {
	it('marks only the newest batch for entrance', () => {
		render(Sparks, { props: { sparks, freshSparkIds: ['new-1'] } });
		expect(document.getElementById('spark-new-1')).toHaveAttribute('data-fresh', 'true');
		expect(document.getElementById('spark-old-1')).not.toHaveAttribute('data-fresh');
		expect(screen.getByRole('heading', { name: 'Fresh sparks' })).toBeVisible();
	});

	it('hides Clear All when there is nothing to clear', () => {
		render(Sparks, { props: { sparks: [], clearButton: true } });
		expect(screen.queryByRole('button', { name: 'Clear All' })).not.toBeInTheDocument();
	});

	it('reports entrance completion from the final fresh card', async () => {
		const onFreshEntranceComplete = vi.fn();
		render(Sparks, {
			props: {
				sparks,
				freshSparkIds: ['new-1', 'old-1'],
				onFreshEntranceComplete,
			},
		});

		await fireEvent(document.getElementById('spark-new-1')!, animationEnd('sparkCardExpand'));
		expect(onFreshEntranceComplete).not.toHaveBeenCalled();

		await fireEvent(document.getElementById('spark-old-1')!, animationEnd('sparkCardExpand'));
		expect(onFreshEntranceComplete).toHaveBeenCalledOnce();
	});

	it('releases the entrance animation once it completes so hover styles can apply', async () => {
		render(Sparks, { props: { sparks, freshSparkIds: ['new-1'] } });
		const card = document.getElementById('spark-new-1')!;

		expect(card).not.toHaveClass('settled');

		await fireEvent(card, animationEnd('sparkCardExpand'));
		expect(card).toHaveClass('settled');
	});

	it('releases the entrance animation after the reduced-motion fade', async () => {
		render(Sparks, { props: { sparks, freshSparkIds: ['new-1'] } });
		const card = document.getElementById('spark-new-1')!;

		await fireEvent(card, animationEnd('fadeIn'));
		expect(card).toHaveClass('settled');
	});

	it('reports entrance completion after the reduced-motion fade', async () => {
		const onFreshEntranceComplete = vi.fn();
		render(Sparks, {
			props: {
				sparks: [sparks[0]],
				freshSparkIds: ['new-1'],
				onFreshEntranceComplete,
			},
		});

		await fireEvent(document.getElementById('spark-new-1')!, animationEnd('fadeIn'));
		expect(onFreshEntranceComplete).toHaveBeenCalledOnce();
	});
});
