<script lang="ts">
	import InputLabelContent from "./InputLabelContent.svelte"

	export let htmlFor: string = ""
	export let type: "radio" | "checkbox" | null = null
	export let formElement: boolean = true
</script>

{#if formElement}
	<label for={htmlFor}>
		<InputLabelContent {type}>
			<slot />
		</InputLabelContent>
	</label>
{/if}

{#if !formElement}
	<InputLabelContent {type}>
		<slot />
	</InputLabelContent>
{/if}
