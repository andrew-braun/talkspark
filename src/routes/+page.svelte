<script lang="ts">
	import RandomPrompt from 'components/organisms/prompts/RandomPrompt.svelte';
</script>

<section class="home-page-container">
	<h1 class="title">Let’s Talk</h1>
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
		width: 100%;
		text-align: center;
		margin-top: var(--spacing-lg);

		@media (width >= 768px) {
			max-width: 860px;
			margin: var(--spacing-xl) auto 0;
		}

		.conversation-container {
			display: flex;
			justify-content: center;
			width: 100%;
		}
	}
</style>
