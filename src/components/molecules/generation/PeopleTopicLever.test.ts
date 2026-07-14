import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PeopleTopicLever from './PeopleTopicLever.svelte';
import { RELATIONSHIP_CONTEXT_OPTIONS, TOPIC_LENS_OPTIONS } from 'lib/data/generation-options';

afterEach(cleanup);

describe('PeopleTopicLever', () => {
	it('shows Default selections and exposes topic choices', async () => {
		const selectTopic = vi.fn();
		render(PeopleTopicLever, {
			props: {
				relationshipOptions: RELATIONSHIP_CONTEXT_OPTIONS,
				topicOptions: TOPIC_LENS_OPTIONS,
				relationshipValue: 'default',
				topicValue: 'default',
				onSelectRelationship: vi.fn(),
				onSelectTopic: selectTopic,
			},
		});

		expect(screen.getByRole('button', { name: /People & topic/i })).toHaveTextContent(
			'Default · Default'
		);
		await fireEvent.click(screen.getByRole('button', { name: /People & topic/i }));
		await fireEvent.click(screen.getByRole('button', { name: 'Stories & memories' }));
		expect(selectTopic).toHaveBeenCalledWith('stories_memories');
	});
});
