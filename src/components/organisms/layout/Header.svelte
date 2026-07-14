<script lang="ts">
	import { resolve } from '$app/paths';
	import Nav from 'components/molecules/nav/Nav.svelte';
	import Logo from 'components/atoms/brand/Logo.svelte';
</script>

<header class="main-header page-spacing">
	<a href={resolve('/')} class="logo-link" title="TalkSpark home page">
		<Logo />
	</a>
	<Nav />
</header>

<style lang="scss">
	.main-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-md);
		padding-top: var(--spacing-lg);
		padding-bottom: var(--spacing-lg);
		border-bottom: 3px solid transparent;
		border-image: var(--gradient-5) 1;

		// Was 100vw, which ignores the scrollbar and overflows — the horizontal scroll it
		// caused was only being hidden by `overflow-x: hidden` on the body.
		width: 100%;

		@media (width >= 768px) {
			padding-top: var(--spacing-xl);
		}

		.logo-link {
			display: flex;
			align-items: center;
			min-height: var(--tap-target-min);
		}
	}
</style>
