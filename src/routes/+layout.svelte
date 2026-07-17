<script lang="ts">
	import type { Snippet } from 'svelte';
	import Header from 'components/organisms/layout/Header.svelte';
	import { fade } from 'svelte/transition';
	import 'styles/variables.css';
	import 'styles/globals.scss';
	import 'styles/animations.css';

	let { data, children }: { data: { pathname: string }; children: Snippet } = $props();
</script>

<Header />

{#key data.pathname}
	<main class="main page-spacing" transition:fade={{ duration: 240 }}>
		{@render children()}
	</main>
{/key}
<footer></footer>
