<script lang="ts">
	import type { Snippet } from 'svelte';
	import Header from 'components/organisms/layout/Header.svelte';
	import Loading from 'components/organisms/loading/Loading.svelte';
	import { loadingState } from 'stores/loading.svelte';
	import { fly } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import 'styles/variables.css';
	import 'styles/globals.scss';
	import 'styles/animations.css';

	let { data, children }: { data: { pathname: string }; children: Snippet } = $props();
</script>

<Header />

<div class="loading">
	<Loading isLoading={loadingState.isLoading} animation="bouncyBox" />
</div>
{#key data.pathname}
	<main
		class="main page-spacing"
		in:fly={{
			easing: cubicOut,
			x: 100,
			duration: 300,
			delay: 350,
		}}
		out:fly={{ easing: cubicIn, x: -100, duration: 300 }}
	>
		{@render children()}
	</main>
{/key}
<footer></footer>

<style lang="scss">
	.loading {
		position: sticky;
		top: 15px;
		margin: var(--spacing-sm) 15px -25px auto;
		width: 25px;
		height: 25px;
		z-index: 100;
	}
</style>
