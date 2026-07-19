<script lang="ts">
	import { generateSparks } from '$lib/generate.remote';
	import { generatedSparks } from 'stores/sparks.svelte';
	import { loadingState } from 'stores/loading.svelte';
	import { generationParams } from 'stores/generation.svelte';
	import Button from 'components/atoms/buttons/Button.svelte';
	import type { SparkData } from 'ts/sparks';

	let {
		buttonText = 'Random Sparks',
		onGenerateStart = () => {},
		onGenerated = async () => {},
		onGenerateError = () => {},
	}: {
		buttonText?: string;
		onGenerateStart?: () => void;
		onGenerated?: (sparks: SparkData[]) => void | Promise<void>;
		onGenerateError?: (error: unknown) => void;
	} = $props();

	export async function generate() {
		if (loadingState.isLoading) return;
		loadingState.isLoading = true;
		onGenerateStart();

		try {
			const { sparks } = await generateSparks(generationParams);
			generatedSparks.add(sparks);
			await onGenerated(sparks);
		} catch (error) {
			onGenerateError(error);
		} finally {
			loadingState.isLoading = false;
		}
	}
</script>

<Button
	variant="primary"
	onClick={generate}
	classes="spark-button"
	disabled={loadingState.isLoading}
	isLoading={loadingState.isLoading}
	loadingText="Sparking..."
>
	{buttonText}
</Button>
