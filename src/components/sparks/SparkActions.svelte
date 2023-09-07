<script lang="ts">
	import type { SparkData } from "ts/sparks"

	import CopyButton from "components/buttons/ActionButtons/CopyButton.svelte"
	import BookmarkButton from "components/buttons/ActionButtons/BookmarkButton.svelte"

	// Props
	export let spark: SparkData
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
