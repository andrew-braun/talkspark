import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DepthSafetyLever from './DepthSafetyLever.svelte';

afterEach(cleanup);

describe('DepthSafetyLever', () => {
	it('allows depth and controversy to remain independently automatic', async () => {
		const onSelect = vi.fn();
		render(DepthSafetyLever, {
			props: {
				value: { depth_level: 'default', controversy_level: 'default' },
				onSelect,
			},
		});

		expect(screen.getByRole('button', { name: /Depth & safety/i })).toHaveTextContent(
			'Depth Default · Controversy Default'
		);
		await fireEvent.click(screen.getByRole('button', { name: /Depth & safety/i }));
		await fireEvent.click(screen.getAllByRole('button', { name: '3' })[0]);
		expect(onSelect).toHaveBeenCalledWith({
			depth_level: 3,
			controversy_level: 'default',
		});
	});
});
