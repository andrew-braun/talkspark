<script lang="ts">
	import Nav from "components/layout/header/nav/Nav.svelte"
	import Logo from "components/brand/Logo.svelte"
</script>

<header class="main-header page-section">
	<a href="/" class="logo-link">
		<Logo />
	</a>
	<Nav />
</header>

<style lang="scss">
	.main-header {
		padding: var(--spacing-xl) var(--spacing-sm) var(--spacing-lg)
			var(--spacing-sm);
		border-bottom: 3px solid transparent;
		border-image: var(--gradient-5) 1;

		.logo-link {
			display: flex;
			align-items: center;
		}
	}
</style>
