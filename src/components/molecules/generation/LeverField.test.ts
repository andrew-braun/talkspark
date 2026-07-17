import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { LEVER_FIELDS } from 'lib/data/generation-options';
import LeverField from './LeverField.svelte';

afterEach(cleanup);

// "Who you're with" single-select lever; its shipped default value is 'anyone'.
const field = LEVER_FIELDS[0];

describe('LeverField', () => {
	it('does not replay the header accent wash when mounted already set', () => {
		render(LeverField, { props: { field, value: 'partner', onSelect: () => {} } });

		const section = document.getElementById('lever-field-relationship_context')!;
		expect(section).toHaveClass('set');
		expect(section).not.toHaveClass('wash');
	});

	it('washes the header when the lever leaves its default after mount', async () => {
		const view = render(LeverField, { props: { field, value: 'anyone', onSelect: () => {} } });
		const section = document.getElementById('lever-field-relationship_context')!;
		expect(section).not.toHaveClass('wash');

		await view.rerender({ value: 'partner' });
		expect(section).toHaveClass('wash');

		await view.rerender({ value: 'anyone' });
		expect(section).not.toHaveClass('wash');
	});
});
