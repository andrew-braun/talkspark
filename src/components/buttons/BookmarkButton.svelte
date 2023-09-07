<script lang="ts">
	import ActionButton from "./ActionButton.svelte"

	import { saved_sparks } from "stores/sparks/saved-sparks"
	import type { SparkData } from "ts/sparks"

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

	const handleSaveClick = () => {
		// If Spark currently exists in Saved store, remove it
		saved_sparks.update((prev) => {
			if (isSaved) {
				return prev.filter((savedSpark) => savedSpark.id !== spark.id)
			}

			// Else, add it
			return [...prev, spark]
		})
	}
</script>

<ActionButton onClick={handleSaveClick} title="Save this spark" type="save">
	{#if isSaved}
		<BiBookmarkHeartFill />
	{:else}
		<BiBookmarkHeart />
	{/if}
</ActionButton>
