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
	.actions {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0 var(--spacing-sm) 0 var(--spacing-md);
	}
</style>
