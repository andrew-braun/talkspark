<script lang="ts">
	import Header from "components/layout/header/Header.svelte"
	import Loading from "components/states/loading/Loading.svelte"
	import { getAnyLoadingState, loadingState } from "stores/app-state/loading"
	import { fly } from "svelte/transition"
	import { cubicIn, cubicOut } from "svelte/easing"
	import "styles/variables.css"
	import "styles/globals.scss"
	import "styles/animations.css"

	export let data

	let isLoading: boolean = false
	loadingState.subscribe((state) => {
		isLoading = getAnyLoadingState(state)
	})
</script>

<Header />

<div class="loading">
	<Loading {isLoading} animation="bouncyBox" />
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
		<slot />
	</main>
{/key}
<footer />

<style lang="scss">
	.loading {
		position: sticky;
		top: 15px;
		margin: var(--spacing-sm) 15px -25px auto;
		width: 25px;
		height: 25px;
		z-index: 80;
		pointer-events: none;
	}
</style>
