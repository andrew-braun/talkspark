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
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: var(--tap-target-min);
		min-height: var(--tap-target-min);
		padding: 0;
		border: none;
		background: transparent;
		color: var(--text-color-light);
		font-size: var(--font-size-md-lg);
		line-height: 1;
		transition:
			transform var(--motion-press) var(--ease-out),
			color var(--motion-feedback) ease,
			opacity var(--motion-feedback) ease;

		&:hover:not(:disabled) {
			cursor: pointer;
			color: var(--accent-color-5);
		}

		&:active:not(:disabled) {
			transform: scale(0.96);
		}

		&:focus-visible {
			outline: 2px solid var(--accent-color-5);
			outline-offset: 2px;
		}

		&:disabled {
			cursor: wait;
			opacity: 0.6;
		}

		@media (prefers-reduced-motion: reduce) {
			transition-duration: var(--motion-reduced);

			&:active:not(:disabled) {
				transform: none;
			}
		}
	}
</style>
