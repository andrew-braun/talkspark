<script lang="ts">
	import { generatedSparks } from 'stores/sparks.svelte';
	import Sparks from 'components/organisms/sparks/Sparks.svelte';
	import GenerationControls from 'components/organisms/generation/GenerationControls.svelte';
	import GenerateSparksButton from 'components/organisms/sparks/GenerateSparksButton.svelte';
	import SparkGenerationStage from 'components/organisms/sparks/SparkGenerationStage.svelte';
	import type { SparkData } from 'ts/sparks';
	import type { GenerationPhase } from 'lib/ui/result-navigation';

	let generator: GenerateSparksButton;
	let phase = $state<GenerationPhase>('idle');
	let freshSparkIds = $state<string[]>([]);
	let startedAt = 0;

	// IDs present when a generation starts. While set, the store's newly written batch
	// stays hidden so a fast response cannot flash plain cards before the 650ms reveal.
	let preGenerationIds = $state<Set<string> | null>(null);

	const visibleSparks = $derived.by(() => {
		const withheldFrom = preGenerationIds;
		if (!withheldFrom) return generatedSparks.items;
		return generatedSparks.items.filter((spark) => withheldFrom.has(spark.id));
	});

	function handleStart() {
		startedAt = performance.now();
		freshSparkIds = [];
		preGenerationIds = new Set(generatedSparks.items.map((spark) => spark.id));
		phase = 'loading';
	}

	async function handleGenerated(sparks: SparkData[]) {
		const remaining = Math.max(0, 650 - (performance.now() - startedAt));
		if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
		freshSparkIds = sparks.map((spark) => spark.id);
		phase = 'revealing';
		preGenerationIds = null;
	}

	function handleError() {
		phase = 'error';
		preGenerationIds = null;
	}
</script>

<div class="dialog-container">
	<GenerationControls />
	<GenerateSparksButton
		bind:this={generator}
		onGenerateStart={handleStart}
		onGenerated={handleGenerated}
		onGenerateError={handleError}
	/>

	<div class="sparks-container">
		<SparkGenerationStage {phase} {freshSparkIds} onRetry={() => generator.generate()} />
		<Sparks
			sparks={visibleSparks}
			clearButton
			{freshSparkIds}
			onFreshEntranceComplete={() => (phase = 'idle')}
		/>
	</div>
</div>

<style lang="scss">
	.dialog-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;

		.sparks-container {
			flex: 1 1 auto;
			width: 100%;
			margin-top: var(--spacing-lg);
		}
	}
</style>
