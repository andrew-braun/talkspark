<script lang="ts">
	import Nav from "components/layout/header/nav/Nav.svelte"
	import Logo from "components/brand/Logo.svelte"
</script>

<header class="main-header page-spacing">
	<a href="/" class="logo-link" title="TalkSpark home page">
		<Logo />
	</a>
	<Nav />
</header>

<style lang="scss">
	.main-header {
		display: flex;
		justify-content: space-between;
		min-height: 75px;
		padding-top: var(--spacing-xl);
		padding-bottom: var(--spacing-lg);
		border-bottom: 3px solid transparent;
		border-image: var(--gradient-5) 1;
		width: 100vw;

		.logo-link {
			display: flex;
			align-items: center;
		}
	}
</style>
