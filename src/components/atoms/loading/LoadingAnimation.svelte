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
</style>
