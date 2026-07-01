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
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-sm);
		margin: var(--spacing-sm) 0;
		padding: var(--spacing-sm) var(--spacing-md);
		border: var(--spark-border);
		border-left: 3px solid var(--accent-color-5);
		border-radius: var(--border-radius-sm);
		background: var(--spark-background-color);
		list-style: none;

		.body {
			flex: 1 1 auto;
			min-width: 0;
		}

		.content {
			margin: 0;
			color: var(--text-color-light);
			font-size: var(--font-size-sm);
			line-height: 1.4;
		}

		.actions {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-left: var(--spacing-sm);
		}
	}
</style>
