<script lang="ts">
	import { browser } from '$app/environment';
	import { tick } from 'svelte';
	import {
		isBelowViewport,
		isOutsideViewport,
		scrollResultIntoView,
		type GenerationPhase,
	} from 'lib/ui/result-navigation';

	let {
		phase = 'idle',
		freshSparkIds = [],
		errorMessage = 'Could not make sparks.',
		onRetry = () => {},
	}: {
		phase?: GenerationPhase;
		freshSparkIds?: string[];
		errorMessage?: string;
		onRetry?: () => void;
	} = $props();

	let stage: HTMLElement;
	let manualIntent = $state(false);
	let showJump = $state(false);
	const reducedMotion = () =>
		browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	$effect(() => {
		if (phase !== 'loading' || !stage) return;
		manualIntent = false;
		showJump = false;
		let cancelled = false;
		void tick().then(() => {
			if (!cancelled && stage && isBelowViewport(stage)) {
				scrollResultIntoView(stage, reducedMotion());
			}
		});
		return () => (cancelled = true);
	});

	$effect(() => {
		if (!browser || (phase !== 'loading' && phase !== 'revealing')) return;
		const markIntent = () => (manualIntent = true);
		const events = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
		for (const event of events) window.addEventListener(event, markIntent, { once: true });
		return () => events.forEach((event) => window.removeEventListener(event, markIntent));
	});

	$effect(() => {
		if (phase !== 'revealing' || freshSparkIds.length === 0) return;
		void tick().then(() => {
			const first = document.getElementById(`spark-${freshSparkIds[0]}`);
			showJump = !!first && isOutsideViewport(first) && manualIntent;
		});
	});

	function jumpToFresh() {
		const first = document.getElementById(`spark-${freshSparkIds[0]}`);
		if (first) scrollResultIntoView(first, reducedMotion());
		showJump = false;
	}
</script>

<section class="generation-stage" class:active={phase !== 'idle'} bind:this={stage}>
	<div class="live-status" role="status" aria-live="polite">
		{phase === 'loading'
			? 'Making three sparks…'
			: phase === 'revealing'
				? 'Three new sparks are ready.'
				: phase === 'error'
					? errorMessage
					: ''}
	</div>

	{#if phase === 'loading'}
		<div class="source-spark" data-testid="source-spark" aria-hidden="true"></div>
	{:else if phase === 'revealing'}
		<div class="split" aria-hidden="true">
			{#each freshSparkIds as id, index (id)}
				<span data-testid="split-seed" class={`seed seed-${index + 1}`}></span>
			{/each}
		</div>
	{:else if phase === 'error'}
		<button type="button" class="retry" onclick={onRetry}>Try again</button>
	{/if}

	{#if showJump}
		<button type="button" class="jump" onclick={jumpToFresh}>3 new sparks</button>
	{/if}
</section>

<style lang="scss">
	.generation-stage {
		position: relative;
		display: grid;
		place-items: center;
		width: 100%;
		min-height: 0;
		overflow: hidden;
		transition: min-height var(--motion-expand) var(--ease-out);

		&.active {
			min-height: calc(var(--spacing-xxl) * 3);
		}

		.live-status {
			z-index: 1;
			max-width: 100%;
			padding: var(--spacing-md);
			text-align: center;
			transition: opacity var(--motion-feedback) var(--ease-out);
		}

		.source-spark,
		.split,
		.seed {
			pointer-events: none;
		}

		.source-spark {
			--spark-drop-distance: var(--spacing-xxl);

			position: absolute;
			top: var(--spacing-md);
			width: var(--spacing-xl);
			height: var(--spacing-xl);
			border-radius: 50%;
			animation: sparkDrop var(--motion-drop) var(--ease-spring) forwards;

			&::before {
				position: absolute;
				inset: 0;
				border-radius: inherit;
				background: var(--gradient-3);
				animation: sparkPulse var(--motion-loader) var(--ease-out) var(--motion-drop)
					infinite;
				content: '';
				pointer-events: none;
			}
		}

		.split {
			position: absolute;
			inset: 0;

			.seed {
				position: absolute;
				top: 50%;
				left: 50%;
				width: var(--spacing-md);
				height: var(--spacing-md);
				border-radius: 50%;
				background: var(--accent-color-1);
				animation: sparkSeedSplit var(--motion-split) var(--ease-out) forwards;

				&.seed-1 {
					--seed-x: calc(var(--spacing-xxl) * -1);
					--seed-y: var(--spacing-xl);

					background: var(--accent-color-2);
				}

				&.seed-2 {
					--seed-x: 0;
					--seed-y: var(--spacing-xxl);

					background: var(--accent-color-4);
				}

				&.seed-3 {
					--seed-x: var(--spacing-xxl);
					--seed-y: var(--spacing-xl);

					background: var(--accent-color-6);
				}
			}
		}

		.retry,
		.jump {
			z-index: 2;
			min-width: var(--tap-target-min);
			min-height: var(--tap-target-min);
			padding: var(--spacing-sm) var(--spacing-lg);
			border: 1px solid var(--accent-color-2);
			border-radius: var(--border-radius-lg);
			background: var(--spark-background-color);
			color: var(--text-color-light);
			font: inherit;
			font-size: var(--font-size-md);
			cursor: pointer;

			&:focus-visible {
				outline: 2px solid var(--accent-color-5);
				outline-offset: 2px;
			}
		}

		.jump {
			position: fixed;
			right: var(--spacing-md);
			bottom: var(--spacing-md);
			box-shadow: var(--box-shadow);
		}

		@media (width >= 768px) {
			&.active {
				min-height: calc(var(--spacing-xxl) * 4);
			}

			.source-spark {
				--spark-drop-distance: calc(var(--spacing-xxl) * 2);
			}

			.split {
				.seed {
					&.seed-1 {
						--seed-x: calc(var(--spacing-xxl) * -2);
					}

					&.seed-3 {
						--seed-x: calc(var(--spacing-xxl) * 2);
					}
				}
			}
		}

		@media (prefers-reduced-motion: reduce) {
			transition-duration: var(--motion-reduced);

			.source-spark,
			.split {
				display: none;
			}

			.live-status {
				transition-duration: var(--motion-reduced);
			}
		}
	}
</style>
