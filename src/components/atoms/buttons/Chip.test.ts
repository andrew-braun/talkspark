import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import Chip from './Chip.svelte';

afterEach(cleanup);

describe('Chip', () => {
	it('does not replay the accent wash when mounted already selected', () => {
		render(Chip, { props: { label: 'Partner', selected: true } });

		expect(screen.getByRole('button', { name: 'Partner' })).not.toHaveClass('wash');
	});

	it('washes only when selection turns on after mount', async () => {
		const view = render(Chip, { props: { label: 'Partner', selected: false } });
		const button = screen.getByRole('button', { name: 'Partner' });
		expect(button).not.toHaveClass('wash');

		await view.rerender({ selected: true });
		expect(button).toHaveClass('wash');

		await view.rerender({ selected: false });
		expect(button).not.toHaveClass('wash');
	});
});
