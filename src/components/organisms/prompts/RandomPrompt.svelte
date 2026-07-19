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
	const minimumLoadingStageMs = 1950;

	// IDs present when a generation starts. While set, the store's newly written batch
	// stays hidden so a fast response cannot flash plain cards before the reveal.
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
		const remaining = Math.max(0, minimumLoadingStageMs - (performance.now() - startedAt));
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
	<div class="generation-trigger" style:justify-content="center">
		<GenerateSparksButton
			bind:this={generator}
			onGenerateStart={handleStart}
			onGenerated={handleGenerated}
			onGenerateError={handleError}
		/>
	</div>

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

		.generation-trigger {
			display: flex;
			justify-content: center;
			width: 100%;
			margin-top: var(--spacing-lg);
		}

		.sparks-container {
			position: relative;
			flex: 1 1 auto;
			width: 100%;
			margin-top: var(--spacing-lg);
		}
	}
</style>
