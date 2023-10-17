<script lang="ts">
	export let progress: number
</script>

<div class="progress-bar">
	<div class="progress-bar-content" style={`width: ${progress}%`} />
</div>

<style lang="scss">
	.progress-bar {
		position: relative;
		width: 100%;
		height: 6px;
		background: var(--fill-color);
		border-radius: var(--border-radius-md);

		.progress-bar-content {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			background-image: var(--gradient-5);
			background-repeat: no-repeat;
			border-radius: var(--border-radius-md);
			transition: all 0.3s ease-in-out;
		}
	}
</style>
