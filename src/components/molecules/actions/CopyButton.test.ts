import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CopyButton from './CopyButton.svelte';

vi.mock('lib/assets/icons/copy.svg?component', () => ({ default: () => {} }));
vi.mock('lib/assets/icons/BiClipboardCheck.svg?component', () => ({ default: () => {} }));

afterEach(cleanup);

describe('CopyButton', () => {
	beforeEach(() => {
		Object.assign(navigator, {
			clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
		});
	});

	it('copies the content to the clipboard', async () => {
		render(CopyButton, { props: { content: 'A question' } });

		await fireEvent.click(screen.getByRole('button', { name: 'Copy to clipboard' }));

		expect(navigator.clipboard.writeText).toHaveBeenCalledWith('A question');
	});

	it('confirms the copy through the popup and the button itself', async () => {
		render(CopyButton, { props: { content: 'A question' } });

		const button = screen.getByRole('button', { name: 'Copy to clipboard' });
		expect(button).not.toHaveClass('active');

		await fireEvent.click(button);

		expect(screen.getByText('Copied')).toBeVisible();
		expect(screen.getByRole('button', { name: 'Copied to clipboard' })).toBeVisible();
		expect(button).toHaveClass('active');
	});
});
