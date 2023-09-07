<script lang="ts">
	import CopyIcon from "lib/assets/icons/copy.svg?component"
	import ActionButton from "./ActionButton.svelte"
	import CopyButtonPopup from "./CopyButtonPopup.svelte"

	// Props
	export let content: string

	// State
	let isPopupActive: boolean = false

	// Copy handler
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
	<span slot="popup">
		<CopyButtonPopup />
	</span>
</ActionButton>
