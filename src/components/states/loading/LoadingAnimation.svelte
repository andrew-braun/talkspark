<script lang="ts">
	import type { AnimationType } from "ts/animation"

	export let animation: AnimationType = "bouncyBox"
</script>

<span class={`loader ${animation}`} />

<style lang="scss">
	.loader {
		width: 100%;
		height: 100%;
		margin: auto;
		position: relative;

		&.bouncyBox {
			// &:before {
			// 	content: "";
			// 	width: 100%;
			// 	height: 5px;
			// 	background: var(--accent-color-4);
			// 	opacity: 0.8;
			// 	position: absolute;
			// 	top: 40px;
			// 	left: 0;
			// 	border-radius: 50%;
			// 	animation: shadow 0.5s linear infinite;
			// }
			&:after {
				content: "";
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
