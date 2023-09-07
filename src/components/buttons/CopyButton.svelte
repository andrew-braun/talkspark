<script lang="ts">
	import CopyIcon from "lib/assets/icons/copy.svg?component"
	import ActionButton from "./ActionButton.svelte"

	export let content: string

	// Copy handler
	const handleCopyClick = () => {
		navigator.clipboard.writeText(content)
	}
</script>

<ActionButton onClick={handleCopyClick} title="Copy to clipboard" type="copy">
	<CopyIcon />
</ActionButton>
