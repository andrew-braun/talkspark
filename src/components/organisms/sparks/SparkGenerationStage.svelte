<script lang="ts">
	import { browser } from '$app/environment';
	import { tick } from 'svelte';
	import {
		isBelowViewport,
		isOutsideViewport,
		scrollResultIntoView,
		type GenerationPhase,
	} from 'lib/ui/result-navigation';
	import { getRevealTarget, type RevealTarget } from 'lib/ui/spark-reveal-geometry';

	let {
		phase = 'idle',
		freshSparkIds = [],
		errorMessage = 'Could not make sparks.',
		onRevealReady = () => {},
		onRetry = () => {},
	}: {
		phase?: GenerationPhase;
		freshSparkIds?: string[];
		errorMessage?: string;
		onRevealReady?: () => void;
		onRetry?: () => void;
	} = $props();

	let stage: HTMLElement;
	let manualIntent = $state(false);
	let showJump = $state(false);
	let revealTargets = $state<RevealTarget[]>([]);
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
			const first = document.getElementById(`spark-target-${freshSparkIds[0]}`);
			showJump = !!first && isOutsideViewport(first) && manualIntent;
		});
	});

	$effect(() => {
		if (phase !== 'revealing' || freshSparkIds.length === 0 || !stage) {
			revealTargets = [];
			return;
		}

		const ids = freshSparkIds.slice();
		let cancelled = false;
		void tick().then(() => {
			if (cancelled || !stage) return;
			const targets = ids.map((id) => document.getElementById(`spark-target-${id}`));
			if (targets.some((target) => !target)) {
				revealTargets = [];
				onRevealReady();
				return;
			}

			const stageRect = stage.getBoundingClientRect();
			revealTargets = targets.map((target) =>
				getRevealTarget(stageRect, target!.getBoundingClientRect())
			);
			onRevealReady();
		});

		return () => {
			cancelled = true;
		};
	});

	function jumpToFresh() {
		const first = document.getElementById(`spark-target-${freshSparkIds[0]}`);
		if (first) scrollResultIntoView(first, reducedMotion());
		showJump = false;
	}
</script>

<section
	class="generation-stage"
	class:active={phase !== 'idle'}
	class:motion-active={phase === 'loading' || phase === 'revealing'}
	class:revealing={phase === 'revealing'}
	bind:this={stage}
>
	{#if phase !== 'idle'}
		<div class="live-status" role="status" aria-live="polite">
			{phase === 'loading'
				? 'Sparking...'
				: phase === 'revealing'
					? 'Three new sparks are ready.'
					: errorMessage}
		</div>
	{/if}

	{#if phase === 'loading'}
		<div class="source-anchor" aria-hidden="true">
			<div class="source-spark starburst" data-testid="source-spark"></div>
		</div>
	{:else if phase === 'revealing'}
		{#if revealTargets.length === freshSparkIds.length}
			<div class="split" aria-hidden="true">
				{#each revealTargets as target, index (freshSparkIds[index])}
					<span
						data-testid="split-seed"
						class={`seed starburst ${['seed-upper', 'seed-middle', 'seed-lower'][index]}`}
						style={`--seed-x: ${target.x}px; --seed-y: ${target.y}px`}
					></span>
				{/each}
			</div>
		{/if}
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

		&.active {
			position: absolute;
			inset: 0;
			z-index: 1;
			overflow: visible;
			pointer-events: none;
		}

		&.motion-active {
			.live-status {
				position: absolute;
				top: 0;
			}
		}

		&.revealing {
			.live-status {
				width: 1px;
				height: 1px;
				margin: -1px;
				padding: 0;
				overflow: hidden;
				clip-path: inset(50%);
				white-space: nowrap;
				border: 0;
			}
		}

		.live-status {
			z-index: 1;
			max-width: 100%;
			padding: var(--spacing-md);
			text-align: center;
			transition: opacity var(--motion-feedback) var(--ease-out);
		}

		.source-anchor,
		.split {
			position: absolute;
			top: 62%;
			left: 50%;
			transform: translate(-50%, -50%);
			pointer-events: none;
		}

		.starburst {
			clip-path: polygon(
				50% 0%,
				61% 31%,
				84% 15%,
				70% 40%,
				100% 50%,
				70% 60%,
				84% 85%,
				61% 69%,
				50% 100%,
				39% 69%,
				16% 85%,
				30% 60%,
				0% 50%,
				30% 40%,
				16% 15%,
				39% 31%
			);
		}

		.source-spark {
			--spark-drop-distance: calc(var(--spacing-xxl) * 2);

			position: relative;
			width: var(--spacing-xl);
			height: var(--spacing-xl);
			background: var(--gradient-3);
			animation:
				sparkDrop var(--motion-drop) var(--ease-spring) forwards,
				sparkPulse var(--motion-loader) var(--ease-out) var(--motion-drop) infinite;
		}

		.split {
			width: 0;
			height: 0;

			.seed {
				position: absolute;
				top: calc(var(--spacing-md) * -0.5);
				left: calc(var(--spacing-md) * -0.5);
				width: var(--spacing-md);
				height: var(--spacing-md);
				animation: sparkSeedSplit var(--motion-split) var(--ease-out) forwards;

				&.seed-upper {
					background: var(--accent-color-2);
				}

				&.seed-middle {
					background: var(--accent-color-4);
				}

				&.seed-lower {
					background: var(--accent-color-6);
				}
			}
		}

		.retry,
		.jump {
			z-index: 2;
			pointer-events: auto;
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

		@media (prefers-reduced-motion: reduce) {
			transition-duration: var(--motion-reduced);

			.source-anchor,
			.split {
				display: none;
			}

			.live-status {
				transition-duration: var(--motion-reduced);
			}
		}
	}
</style>
