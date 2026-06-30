<script lang="ts">
	import type { AnimationType } from 'ts/animation';

	let { animation = 'bouncyBox' }: { animation?: AnimationType } = $props();
</script>

<span class={`loader ${animation}`}></span>

<style lang="scss">
	.loader {
		width: 100%;
		height: 100%;
		margin: auto;
		position: relative;

		&.bouncyBox {
			&::after {
				content: '';
				width: 100%;
				height: 100%;
				background: var(--accent-color-3);
				animation: bxSpin 0.6s linear infinite;
				position: absolute;
				top: 0;
				left: 0;
				border-radius: var(--border-radius-lg);
			}
		}
	}

	@keyframes bxSpin {
		17% {
			border-bottom-right-radius: 3px;
		}

		25% {
			transform: translateY(7px) rotate(22.5deg);
		}

		50% {
			transform: translateY(14px) scale(1, 0.9) rotate(45deg);
			border-bottom-right-radius: 40px;
		}

		75% {
			transform: translateY(7px) rotate(67.5deg);
		}

		100% {
			transform: translateY(0) rotate(90deg);
		}
	}

	@keyframes shadow {
		0%,
		100% {
			transform: scale(1, 1);
		}

		50% {
			transform: scale(1.2, 1);
		}
	}
</style>
