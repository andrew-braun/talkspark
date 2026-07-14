<script lang="ts">
	import { generationParams } from 'stores/generation.svelte';
	import PeopleTopicLever from 'components/molecules/generation/PeopleTopicLever.svelte';
	import LeverSelect from 'components/molecules/generation/LeverSelect.svelte';
	import DepthSafetyLever from 'components/molecules/generation/DepthSafetyLever.svelte';
	import GenerateSparksButton from 'components/organisms/sparks/GenerateSparksButton.svelte';
	import {
		RELATIONSHIP_CONTEXT_OPTIONS,
		TOPIC_LENS_OPTIONS,
		CONVERSATION_GOAL_OPTIONS,
		VIBE_OPTIONS,
		DEFAULT_GENERATION_PARAMS,
	} from 'lib/data/generation-options';

	let { onGenerate = async () => {} }: { onGenerate?: () => Promise<void> } = $props();
</script>

<div class="generation-controls">
	<div class="lever-row">
		<PeopleTopicLever
			relationshipOptions={RELATIONSHIP_CONTEXT_OPTIONS}
			topicOptions={TOPIC_LENS_OPTIONS}
			relationshipValue={generationParams.relationship_context}
			topicValue={generationParams.topic_lens}
			onSelectRelationship={(v) => (generationParams.relationship_context = v)}
			onSelectTopic={(v) => (generationParams.topic_lens = v)}
		/>

		<LeverSelect
			label="Conversation goal"
			options={CONVERSATION_GOAL_OPTIONS}
			value={generationParams.conversation_goal}
			onSelect={(v) => (generationParams.conversation_goal = v)}
		/>

		<LeverSelect
			label="Vibe"
			options={VIBE_OPTIONS}
			value={generationParams.vibe}
			onSelect={(v) => (generationParams.vibe = v)}
		/>

		<DepthSafetyLever
			value={generationParams.depth_and_safety ?? DEFAULT_GENERATION_PARAMS.depth_and_safety!}
			onSelect={(v) => (generationParams.depth_and_safety = v)}
		/>
	</div>

	<GenerateSparksButton onClick={onGenerate} />
</div>

<style lang="scss">
	.generation-controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-lg);
		width: 100%;

		// Mobile: levers stack one per row. A 2x2 grid was tried first, but a half-width cell
		// can't fit a 16px label beside its value, and the text floor wins over density.
		// Desktop: back to a centered wrapping row.
		.lever-row {
			display: grid;
			grid-template-columns: 1fr;
			gap: var(--spacing-sm);
			width: 100%;

			@media (width >= 768px) {
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
			}
		}
	}
</style>
