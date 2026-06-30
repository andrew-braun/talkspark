<script lang="ts">
	import type { SparkData } from "ts/sparks"
	import CopyButton from "components/molecules/actions/CopyButton.svelte"
	import BookmarkButton from "components/molecules/actions/BookmarkButton.svelte"

	let { spark }: { spark: SparkData } = $props()
</script>

<div class="actions">
	<CopyButton content={spark.content} />
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
