<script lang="ts">
	import type { SparkData } from "ts/sparks"
	import CopyIcon from "lib/assets/icons/copy.svg?component"
	import BiBookmarkHeart from "lib/assets/icons/BiBookmarkHeart.svg?component"
	import BiBookmarkHeartFill from "lib/assets/icons/BiBookmarkHeartFill.svg?component"

	export let spark: SparkData
	export let index: number

	const handleCopyClick = () => {
		navigator.clipboard.writeText(spark.content)
	}

	const handleSaveClick = () => {
		console.log("Save")
	}
</script>

<article class={`spark gradient-${index}`}>
	<div class="content">{spark.content}</div>
	<div class="actions">
		<button class="copy" title="Copy to clipboard" on:click={handleCopyClick}>
			<CopyIcon />
		</button>
		<button class="copy" title="Copy to clipboard" on:click={handleCopyClick}>
			<BiBookmarkHeart />
		</button>
	</div>
</article>

<style lang="scss">
	.spark {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
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

		.actions {
			padding: 0 var(--spacing-sm) 0 var(--spacing-md);
			.copy {
				background: transparent;
				border: none;
				color: var(--text-light);

				&:hover {
					cursor: pointer;
				}
				&:active {
					transform: scale(0.9);
				}
			}
		}
	}
</style>
