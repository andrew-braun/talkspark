<script lang="ts">
	import InputLabel from "./InputLabel/InputLabel.svelte"

	export let id: name
	export let placeholder: string | null | undefined = null
	export let label: string
</script>

<InputLabel htmlFor={id}>{label}</InputLabel>
<input type="text" {id} {placeholder} class="text-input" />

<style lang="scss">
	.text-input {
		width: 100%;
		height: 38px;
		padding: var(--spacing-md);
		border: 1px solid var(--secondary-color);
		border-radius: var(--border-radius-lg);
		background-color: var(--fill-color);
		color: var(--text-color-light);
	}
</style>
