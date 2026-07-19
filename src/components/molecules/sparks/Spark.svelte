<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import type { SparkData } from 'ts/sparks';
	import { parentFollowups } from 'stores/followups.svelte';
	import CritiqueBadge from 'components/molecules/sparks/CritiqueBadge.svelte';
	import Followup from 'components/molecules/sparks/Followup.svelte';
	import SparkActions from 'components/organisms/sparks/SparkActions.svelte';

	let {
		spark,
		index,
		freshIndex,
		revealReady = true,
		onFreshEntranceComplete,
	}: {
		spark: SparkData;
		index: number;
		freshIndex?: number;
		revealReady?: boolean;
		onFreshEntranceComplete?: () => void;
	} = $props();

	let followups = $derived(parentFollowups.getForParent(spark.id));

	// Once the entrance animation finishes, its `both` fill would keep pinning `transform`
	// (blocking the desktop hover lift) for as long as `.fresh` remains. Flag completion so
	// the style block can drop the animation while `.fresh` keeps identifying the batch.
	let entranceComplete = $state(false);
</script>

{#if spark}
	<div id={`spark-target-${spark.id}`} class={`spark-group gradient-${index}`}>
		<article
			id={`spark-${spark.id}`}
			class="spark"
			class:fresh={freshIndex !== undefined}
			class:pending={freshIndex !== undefined && !revealReady}
			class:reveal-ready={freshIndex !== undefined && revealReady}
			class:settled={entranceComplete}
			data-fresh={freshIndex !== undefined || undefined}
			onanimationend={(event) => {
				if (
					event.target === event.currentTarget &&
					(event.animationName === 'sparkCardExpand' || event.animationName === 'fadeIn')
				) {
					entranceComplete = true;
					onFreshEntranceComplete?.();
				}
			}}
		>
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
		max-width: 700px;
		margin: var(--spacing-xl) 0;
		margin-left: -6px;

		// Each gradient maps to one solid accent so card actions (save, copy feedback)
		// inherit their card's colour family instead of a global accent.
		&.gradient-1 {
			--spark-accent: var(--accent-color-3);
		}

		&.gradient-2 {
			--spark-accent: var(--accent-color-5);
		}

		&.gradient-3 {
			--spark-accent: var(--accent-color-1);
		}

		&.gradient-4 {
			--spark-accent: var(--accent-color-4);
		}
	}

	.spark {
		flex: 1 1 auto;
		position: relative;

		// Mobile: content over actions, so the starter text gets the full card width
		// instead of competing with an icon rail. Desktop restores the side-by-side row.
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--spacing-sm);
		width: 100%;
		padding: var(--spacing-md);
		border: var(--spark-border);
		border-radius: var(--border-radius-md);
		background: var(--spark-background-color);
		text-align: left;
		line-height: 1.4;

		&.fresh {
			transform-origin: left center;

			// The entrance ends on the identity frame, so dropping the animation is
			// invisible — but it releases `transform` for the desktop hover lift.
			&.settled {
				animation: none;
			}
		}

		&.pending {
			opacity: 0;
			transform: none;
			animation: none;
		}

		&.reveal-ready {
			animation: sparkCardExpand var(--motion-expand) var(--ease-spring) both;
			animation-delay: calc(var(--motion-split) - var(--motion-feedback));
		}

		@media (width >= 768px) {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			gap: 0;
			transition:
				transform var(--motion-press) var(--ease-out),
				box-shadow var(--motion-feedback) ease;

			// Decorative lift only — actions stay visible on every device.
			&:hover {
				transform: translateY(-2px);
				box-shadow: var(--box-shadow);
			}
		}

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

		@media (prefers-reduced-motion: reduce) {
			transition-duration: var(--motion-reduced);

			&:hover {
				transform: none;
			}

			&.fresh.reveal-ready {
				animation-name: fadeIn;
				animation-duration: var(--motion-reduced);
				animation-delay: 0ms;
			}
		}
	}

	.followups {
		margin: var(--spacing-sm) 0 0 var(--spacing-lg);
		padding: 0;
	}
</style>
