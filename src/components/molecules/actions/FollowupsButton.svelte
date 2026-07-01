<script lang="ts">
	import { generateFollowups } from '$lib/followups.remote';
	import { parentFollowups } from 'stores/followups.svelte';
	import type { SparkData } from 'ts/sparks';

	let { spark }: { spark: SparkData } = $props();

	let isLoading = $state(false);

	const handleFollowupsClick = async () => {
		isLoading = true;

		try {
			const { followups } = await generateFollowups({ parent: spark });
			parentFollowups.setForParent(spark.id, followups);
		} catch (error) {
			console.error(error);
		} finally {
			isLoading = false;
		}
	};
</script>

<button
	type="button"
	class="action followup"
	title="Generate follow-ups"
	disabled={isLoading}
	onclick={handleFollowupsClick}
>
	{isLoading ? '…' : '↳'}
</button>

<style lang="scss">
	.action {
		position: relative;
		border: none;
		background: transparent;
		color: var(--text-color-light);
		margin: var(--spacing-xs) 0;
		font-size: var(--font-size-md-lg);
		line-height: 1;

		&:hover:not(:disabled) {
			cursor: pointer;
			color: var(--accent-color-5);
		}

		&:active:not(:disabled) {
			transform: scale(0.9);
		}

		&:disabled {
			cursor: wait;
			opacity: 0.6;
		}
	}
</style>
