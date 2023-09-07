<script lang="ts">
	import BiClipboardCheck from "lib/assets/icons/BiClipboardCheck.svg?component"
</script>

<span class="copy-popup">
	<BiClipboardCheck width="14" height="14" />
	<span class="text">Copied</span>
</span>

<style lang="scss">
	.copy-popup {
		display: flex;
		align-items: center;
		font-weight: 500;

		.text {
			margin-left: 5px;
		}
	}
</style>
