<script lang="ts">
	import Random from "components/prompts/random/Random.svelte"
</script>

<section class="page-section home-page-container">
	<h1>Spark A Conversation!</h1>
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
		width: 100%;
		height: 100%;

		.conversation-container {
			display: flex;
			justify-content: center;
			width: 100%;
		}
	}
</style>
