<script lang="ts">
	export let link: string = "#"
</script>

<a href={link} class="nav-link">
	<slot />
</a>

<style lang="scss">
	.nav-link {
		position: relative;
		display: block;
		color: var(--text-color-dark);
		text-decoration: none;
		padding: var(--spacing-md);
		border-radius: var(--border-radius-sm);
		transition: all 0.3s ease-in-out;
		background-image: var(--gradient-5);
		background-size: 300%;
		background-position: 100% 0;
		font-weight: 500;

		&:hover {
			background-position: 150% 100%;
		}
	}
</style>
