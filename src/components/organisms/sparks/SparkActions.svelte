<script lang="ts">
	import type { SparkData } from 'ts/sparks';
	import CopyButton from 'components/molecules/actions/CopyButton.svelte';
	import BookmarkButton from 'components/molecules/actions/BookmarkButton.svelte';
	import FollowupsButton from 'components/molecules/actions/FollowupsButton.svelte';

	let { spark }: { spark: SparkData } = $props();
</script>

<div class="actions">
	<CopyButton content={spark.content} />
	<FollowupsButton {spark} />
	<BookmarkButton {spark} />
</div>

<style lang="scss">
	// Mobile: a right-aligned row under the content, so three 44px targets get real
	// separation. They used to be a column of ~26px icons split by 4.8px of dead space,
	// which made "copy" and "bookmark" near-indistinguishable to a thumb.
	.actions {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		gap: var(--tap-gap-min);

		@media (width >= 768px) {
			flex-direction: column;
			justify-content: center;
			gap: 0;
			padding: 0 var(--spacing-sm) 0 var(--spacing-md);
		}
	}
</style>
