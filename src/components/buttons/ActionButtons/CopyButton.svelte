<script lang="ts">
	import CopyIcon from "lib/assets/icons/copy.svg?component"
	import ActionButton from "./ActionButton.svelte"
	import CopyButtonPopup from "./CopyButtonPopup.svelte"

	let { content }: { content: string } = $props()

	let isPopupActive = $state(false)

	const handleCopyClick = () => {
		navigator.clipboard.writeText(content)
		isPopupActive = true

		window.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				isPopupActive = false
			}
		})

		setTimeout(() => {
			isPopupActive = false
		}, 1300)
	}
</script>

<ActionButton
	onClick={handleCopyClick}
	title="Copy to clipboard"
	type="copy"
	{isPopupActive}
>
	<CopyIcon />
	{#snippet popup()}
		<CopyButtonPopup />
	{/snippet}
</ActionButton>
