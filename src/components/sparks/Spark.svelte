<script lang="ts">
	import type { SparkData } from "ts/sparks"

	export let spark: SparkData
	export let index: number
</script>

<article class={`spark gradient-${index}`}>{spark.content}</article>

<style lang="scss">
	.spark {
		position: relative;
		display: flex;
		align-items: center;
		max-width: 600px;
		height: 80px;
		margin: var(--spacing-xl) 0;
		margin-left: -6px;
		padding: var(--spacing-md);
		border: var(--spark-border);
		border-radius: var(--border-radius-md);
		background: var(--spark-background-color);
		text-align: left;

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
		}
		&.gradient-2::before {
			background: var(--gradient-2);
		}
		&.gradient-3::before {
			background: var(--gradient-3);
		}
		&.gradient-4::before {
			background: var(--gradient-4);
		}
	}
</style>
