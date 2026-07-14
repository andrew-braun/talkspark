<script lang="ts">
	import type { Followup } from 'ts/followup';
	import CritiqueBadge from 'components/molecules/sparks/CritiqueBadge.svelte';
	import CopyButton from 'components/molecules/actions/CopyButton.svelte';
	import FollowupKeepButton from 'components/molecules/actions/FollowupKeepButton.svelte';

	let {
		followup,
		gradientIndex = 1,
	}: {
		followup: Followup;
		gradientIndex?: number;
	} = $props();
</script>

<li class="followup">
	<div class="body">
		{#if followup.critique}
			<CritiqueBadge critique={followup.critique} {gradientIndex} />
		{/if}
		<p class="content">{followup.content}</p>
	</div>
	<div class="actions">
		<CopyButton content={followup.content} />
		<FollowupKeepButton {followup} />
	</div>
</li>

<style lang="scss">
	.followup {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--spacing-sm);
		margin: var(--spacing-sm) 0;
		padding: var(--spacing-sm) var(--spacing-md);
		border: var(--spark-border);
		border-left: 3px solid var(--accent-color-5);
		border-radius: var(--border-radius-sm);
		background: var(--spark-background-color);
		list-style: none;

		// The follow-up list sits outside `.spark`, so without this it inherits
		// `text-align: center` from the home page container.
		text-align: left;

		@media (width >= 768px) {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}

		.body {
			flex: 1 1 auto;
			min-width: 0;
		}

		.content {
			margin: 0;
			color: var(--text-color-light);

			// Was --font-size-sm, which landed at 9.6px on a phone under the old shrink.
			// Follow-ups are body copy and need to be read, not squinted at.
			font-size: var(--font-size-md);
			line-height: 1.4;
		}

		.actions {
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			align-items: center;
			gap: var(--tap-gap-min);

			@media (width >= 768px) {
				flex-direction: column;
				gap: 0;
				padding-left: var(--spacing-sm);
			}
		}
	}
</style>
