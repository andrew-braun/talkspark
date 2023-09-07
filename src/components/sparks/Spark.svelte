<script lang="ts">
	import { fade } from "svelte/transition"
	import type { SparkData } from "ts/sparks"
	import SparkActions from "./SparkActions.svelte"
	import { afterUpdate } from "svelte"

	export let spark: SparkData
	export let index: number

	let visible = false

	afterUpdate(() => {
		visible = true
	})
</script>

{#if spark && visible}
	<article class={`spark gradient-${index}`} in:fade>
		<div class="content">{spark.content}</div>
		<SparkActions {spark} />
	</article>
{/if}

<style lang="scss">
	.spark {
		flex: 1 1 auto;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		max-width: 600px;
		max-height: 140px;
		margin: var(--spacing-xl) 0;
		margin-left: -6px;
		padding: var(--spacing-md);
		border: var(--spark-border);
		border-radius: var(--border-radius-md);
		background: var(--spark-background-color);
		text-align: left;
		line-height: 1.4;

		&::before {
			position: absolute;
			top: 6px;
			left: 6px;
			content: "";
			width: 100%;
			height: 101%;
			border-radius: var(--border-radius-sm);
			z-index: -1;
		}

		&.gradient-1::before {
			background: var(--gradient-1);
			z-index: -1;
		}
		&.gradient-2::before {
			background: var(--gradient-2);
			z-index: -1;
		}
		&.gradient-3::before {
			background: var(--gradient-3);
			z-index: -1;
		}
		&.gradient-4::before {
			background: var(--gradient-4);
			z-index: -1;
		}
	}
</style>
