<script lang="ts">
	import Header from "components/layout/header/Header.svelte"
	import Loading from "components/states/loading/Loading.svelte"
	import { loadingState } from "stores/app-state/loading"
	import "styles/variables.css"
	import "styles/globals.scss"
	import "styles/animations.css"

	let isLoading: boolean = false
	loadingState.subscribe((state) => {
		isLoading = state
	})
</script>

<Header />

<div class="loading">
	<Loading {isLoading} />
</div>

<main>
	<slot />
</main>

<footer />

<style lang="scss">
	.loading {
		position: fixed;
		top: 70px;
		right: 15px;
		width: 25px;
		height: 25px;
		z-index: 100;
	}
</style>
