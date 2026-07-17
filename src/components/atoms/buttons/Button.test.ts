import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import Button from './Button.svelte';

afterEach(() => {
	cleanup();
});

describe('Button', () => {
	it('applies the variant class', () => {
		render(Button, { props: { variant: 'basic' } });

		expect(screen.getByRole('button')).toHaveClass('variant-basic');
	});

	it('shows loading text while loading', () => {
		render(Button, {
			props: {
				isLoading: true,
				loadingText: 'Working...',
			},
		});

		expect(screen.getByRole('button')).toHaveTextContent('Working...');
	});

	it('exposes loading state to assistive technology', () => {
		render(Button, { props: { isLoading: true, loadingText: 'Making three sparks…' } });

		expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
		expect(screen.getByRole('button')).toHaveAttribute('data-loading', 'true');
	});

	it('can be disabled', () => {
		render(Button, {
			props: {
				disabled: true,
			},
		});

		expect(screen.getByRole('button')).toBeDisabled();
	});
});
