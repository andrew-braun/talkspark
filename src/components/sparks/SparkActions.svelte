<script lang="ts">
	import { saved_sparks } from "stores/sparks/saved-sparks"
	import type { SparkData } from "ts/sparks"

	import CopyIcon from "lib/assets/icons/copy.svg?component"
	import BiBookmarkHeart from "lib/assets/icons/BiBookmarkHeart.svg?component"
	import BiBookmarkHeartFill from "lib/assets/icons/BiBookmarkHeartFill.svg?component"

	// Props
	export let spark: SparkData

	// Stores
	let savedSparks: SparkData[] = []
	saved_sparks.subscribe((sparks) => {
		savedSparks = sparks
	})

	// Check if spark is in saved store
	$: isSaved = savedSparks.some((savedSpark) => savedSpark.id === spark.id)

	// Copy
	const handleCopyClick = () => {
		navigator.clipboard.writeText(spark.content)
	}

	const handleSaveClick = () => {
		saved_sparks.update((prev) => {
			if (isSaved) {
				return prev.filter((savedSpark) => savedSpark.id !== spark.id)
			}
			return [...prev, spark]
		})
	}
</script>

<div class="actions">
	<button
		class="action copy"
		title="Copy to clipboard"
		on:click={handleCopyClick}
	>
		<CopyIcon />
	</button>
	<button
		class="action save"
		title="Copy to clipboard"
		on:click={handleSaveClick}
	>
		{#if isSaved}
			<BiBookmarkHeartFill />
		{:else}
			<BiBookmarkHeart />
		{/if}
	</button>
</div>

<style lang="scss">
	.actions {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0 var(--spacing-sm) 0 var(--spacing-md);
		.action {
			border: none;
			background: transparent;
			color: var(--text-light);

			&:hover {
				cursor: pointer;
			}
			&:active {
				transform: scale(0.9);
			}
			&.copy {
				margin-left: 2px;
				margin-bottom: var(--spacing-sm);
			}
		}
	}
</style>
