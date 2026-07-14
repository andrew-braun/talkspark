<script lang="ts">
	import RandomPrompt from 'components/organisms/prompts/RandomPrompt.svelte';
</script>

<section class="home-page-container">
	<h1 class="title">Spark a Conversation!</h1>
	<p class="subtitle">
		Press a button to generate conversation starters through the power of AI.
	</p>
	<div class="conversation-container">
		<RandomPrompt />
	</div>
</section>

<style lang="scss">
	.home-page-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;

		// A phone screen can't spare 10dvh above the fold just to centre things; desktop can.
		margin-top: var(--spacing-lg);

		@media (width >= 768px) {
			margin-top: 10dvh;
		}

		.subtitle {
			margin-bottom: var(--spacing-xl);

			@media (width >= 768px) {
				margin-bottom: var(--spacing-xxl);
			}
		}

		.conversation-container {
			display: flex;
			justify-content: center;
			width: 100%;
		}
	}
</style>
