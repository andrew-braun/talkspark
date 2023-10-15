<script lang="ts">
	import { customizationFlowPages } from "lib/data/pages/customization-flow"
	import FlowPage from "components/generate/FlowPage.svelte"
	import type { FlowPageProps } from "ts/flow"
	import Pages from "components/pagination/Pages.svelte"

	const pageComponents = customizationFlowPages.map((page: FlowPageProps) => {
		return {
			component: FlowPage,
			props: page,
		}
	})
</script>

<div class="customization-flow">
	<Pages pages={pageComponents} />
</div>

<style lang="scss">
	.customization-flow {
		color: var(--text-color-light);
	}
</style>
