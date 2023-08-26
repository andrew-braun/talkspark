<script lang="ts">
	import Random from "components/prompts/random/Random.svelte"
</script>

<section class="page-section home-page-container">
	<h1 class="title">Spark a Conversation!</h1>
	<p class="subtitle">
		Press a button to generate conversation starters through the power of AI.
	</p>
	<div class="conversation-container">
		<Random />
	</div>
</section>

<style lang="scss">
	.home-page-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 10dvh;
		text-align: center;

		.subtitle {
			margin-bottom: var(--spacing-xxl);
		}

		.conversation-container {
			display: flex;
			justify-content: center;
			width: 100%;
		}
	}
</style>
