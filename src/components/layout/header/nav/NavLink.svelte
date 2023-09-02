<script lang="ts">
	export let link: string = "#"
</script>

<a href={link} class="nav-link">
	<slot />
</a>

<style lang="scss">
	.nav-link {
		display: block;
		color: var(--text-color-light);
		text-decoration: none;
		padding: var(--spacing-md);
		transition: var(--transition-std);
		background-repeat: repeat;
		background-position: top right;
		background-size: 100%;

		&:hover {
			color: transparent;
			background-image: var(--gradient-1);
			background-clip: text;
			-webkit-background-clip: text;
			-moz-background-clip: text;
			-webkit-text-fill-color: transparent;
			-moz-text-fill-color: transparent;
		}
	}
</style>
