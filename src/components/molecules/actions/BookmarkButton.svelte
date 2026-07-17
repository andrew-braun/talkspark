<script lang="ts">
	import ActionButton from './ActionButton.svelte';
	import { savedSparks } from 'stores/sparks.svelte';
	import type { SparkData } from 'ts/sparks';

	import BiBookmarkHeart from 'lib/assets/icons/BiBookmarkHeart.svg?component';
	import BiBookmarkHeartFill from 'lib/assets/icons/BiBookmarkHeartFill.svg?component';

	let { spark }: { spark: SparkData } = $props();

	let isSaved = $derived(savedSparks.items.some((s) => s.id === spark.id));

	const handleSaveClick = () => {
		if (isSaved) {
			savedSparks.remove(spark.id);
		} else {
			savedSparks.add([spark]);
		}
	};
</script>

<ActionButton onClick={handleSaveClick} title="Save this spark" type="save" active={isSaved}>
	{#if isSaved}
		<BiBookmarkHeartFill />
	{:else}
		<BiBookmarkHeart />
	{/if}
</ActionButton>
