<script lang="ts">
	import type { SparkData } from 'ts/sparks';
	import { generatedSparks } from 'stores/sparks.svelte';
	import Spark from 'components/molecules/sparks/Spark.svelte';
	import { sortByDate } from 'lib/utils/sort';
	import Button from 'components/atoms/buttons/Button.svelte';

	let {
		sparks = [],
		sparkStore = generatedSparks,
		clearButton = false,
		freshSparkIds = [],
		revealReady = true,
		onFreshEntranceComplete,
	}: {
		sparks?: SparkData[];
		sparkStore?: typeof generatedSparks;
		clearButton?: boolean;
		freshSparkIds?: string[];
		revealReady?: boolean;
		onFreshEntranceComplete?: () => void;
	} = $props();

	let sortedSparks = $derived(
		sortByDate({ objects: sparks, dateField: 'created_at', direction: 'DESC' })
	);

	let clearing = $state(false);

	// Let the withdraw animation play out before the store mutation removes the cards.
	async function clearSparks() {
		if (clearing || sparks.length === 0) return;
		clearing = true;
		await new Promise((resolve) => setTimeout(resolve, 220));
		sparkStore.clear();
		clearing = false;
	}
</script>

<div class="sparks">
	<div class="response-container" class:clearing>
		<div class="actions">
			{#if clearButton && sortedSparks.length > 0}
				<Button
					type="reset"
					variant="basic"
					classes="clear-button"
					disabled={clearing}
					onClick={clearSparks}>Clear All</Button
				>
			{/if}
		</div>

		{#each sortedSparks as spark, index (spark.id)}
			{@const freshIndex = freshSparkIds.indexOf(spark.id)}
			{#if freshIndex === 0}
				<h2 class="fresh-heading">Fresh sparks</h2>
			{/if}
			<Spark
				{spark}
				index={(Math.floor(index) % 4) + 1}
				freshIndex={freshIndex >= 0 ? freshIndex : undefined}
				{revealReady}
				onFreshEntranceComplete={freshIndex >= 0 && freshIndex === freshSparkIds.length - 1
					? onFreshEntranceComplete
					: undefined}
			/>
		{/each}
	</div>
</div>

<style lang="scss">
	.sparks {
		flex: 1 1 auto;
		display: flex;
		justify-content: center;
		width: 100%;
		margin-top: var(--spacing-md);

		&:global(.clear-button) {
			margin-left: auto;
		}

		// Was `width: max-content`, which let the column grow past a phone's viewport.
		.response-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
			max-width: 700px;

			.actions {
				display: flex;
				justify-content: flex-end;
				width: 100%;
			}

			.fresh-heading {
				align-self: flex-start;
				margin: var(--spacing-md) 0 0;
				font-size: var(--font-size-lg);
			}

			// Cards withdraw together for the 220ms window before the store empties.
			&.clearing :global(.spark-group) {
				animation: sparkWithdraw var(--motion-feedback) var(--ease-out) both;
			}

			@media (prefers-reduced-motion: reduce) {
				&.clearing :global(.spark-group) {
					animation: fadeIn var(--motion-reduced) var(--ease-out) reverse both;
				}
			}
		}
	}
</style>
