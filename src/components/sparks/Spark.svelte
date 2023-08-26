<script lang="ts">
	import type { SparkData } from "ts/sparks"

	export let spark: SparkData

	console.log(spark)
</script>

<article class="spark">{spark.content}</article>

<style lang="scss">
	.spark {
		display: flex;
		align-items: center;
		height: 80px;
		margin: var(--spacing-lg) 0;
		padding: var(--spacing-md);
		border: var(--spark-border);
		border-radius: var(--border-radius-md);
		background: var(--spark-background-color);
		text-align: left;
	}
</style>
