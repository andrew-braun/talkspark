<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import type { SparkData } from 'ts/sparks';
	import { parentFollowups } from 'stores/followups.svelte';
	import CritiqueBadge from 'components/molecules/sparks/CritiqueBadge.svelte';
	import Followup from 'components/molecules/sparks/Followup.svelte';
	import SparkActions from 'components/organisms/sparks/SparkActions.svelte';

	let { spark, index }: { spark: SparkData; index: number } = $props();

	let followups = $derived(parentFollowups.getForParent(spark.id));
</script>

{#if spark}
	<div class="spark-group">
		<article class="spark" transition:fade>
			<span class={`gradient gradient-${index}`} transition:slide></span>
			<div class="body">
				{#if spark.critique}
					<CritiqueBadge critique={spark.critique} gradientIndex={index} />
				{/if}
				<div class="content">{spark.content}</div>
			</div>
			<SparkActions {spark} />
		</article>

		{#if followups.length > 0}
			<ul class="followups" transition:fade>
				{#each followups as followup (followup.id)}
					<Followup {followup} gradientIndex={index} />
				{/each}
			</ul>
		{/if}
	</div>
{/if}

<style lang="scss">
	.spark-group {
		width: 100%;
		max-width: 600px;
		margin: var(--spacing-xl) 0;
		margin-left: -6px;
	}

	.spark {
		flex: 1 1 auto;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--spacing-md);
		border: var(--spark-border);
		border-radius: var(--border-radius-md);
		background: var(--spark-background-color);
		text-align: left;
		line-height: 1.4;

		.body {
			flex: 1 1 auto;
			min-width: 0;
		}

		.content {
			line-height: 1.4;
		}

		.gradient {
			position: absolute;
			top: 6px;
			left: 6px;
			content: '';
			width: 100%;
			height: 101%;
			border-radius: var(--border-radius-sm);
			z-index: -1;
			animation-name: fadeIn;
			animation-duration: 0.3s;
			animation-fill-mode: forwards;
			animation-timing-function: ease-out;
			animation-delay: 0.1s;
			opacity: 0;

			&.gradient-1 {
				background: var(--gradient-1);
				z-index: -1;
			}

			&.gradient-2 {
				background: var(--gradient-2);
				z-index: -1;
			}

			&.gradient-3 {
				background: var(--gradient-3);
				z-index: -1;
			}

			&.gradient-4 {
				background: var(--gradient-4);
				z-index: -1;
			}
		}
	}

	.followups {
		margin: var(--spacing-sm) 0 0 var(--spacing-lg);
		padding: 0;
	}
</style>
