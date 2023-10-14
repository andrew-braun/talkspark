<script>
	import { fade, fly } from "svelte/transition"
	import Close from "lib/assets/icons/Close.svg?component"
	// import Button from "components/buttons/Button.svelte"
	import ActionButton from "components/buttons/ActionButtons/ActionButton.svelte"

	export let open = false
	export let closeCustomModal = () => {}
</script>

{#if open === true}
	<div class="modal" in:fly={{ x: "-100%" }} out:fly={{ x: "100%" }}>
		<div class="modal-content">
			<span class="close-button">
				<ActionButton onClick={closeCustomModal} type="utility" title="">
					<span class="close-button-svg"><Close /></span>
				</ActionButton>
			</span>
			<h2 class="modal-header">
				<span class="modal-title"><slot name="modalTitle" /></span>
			</h2>
			<div class="modal-body">
				<slot name="modalBody" />
			</div>
			<div class="modal-footer" />
		</div>
	</div>
{/if}

<style lang="scss">
	.modal {
		position: fixed;
		top: 75px;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;

		.modal-content {
			width: clamp(300px, 60%, 600px);
			// min-height: 400px;
			height: 50%;
			background-color: var(--background-color);
			border: 2px solid var(--accent-color-3);
			border-radius: 10px;
			display: flex;
			flex-direction: column;
			overflow: auto;

			@media (max-width: 480px) {
				width: 100%;
				height: 100%;
				border: none;
			}

			.close-button {
				width: max-content;
				margin-left: auto;
				padding: var(--spacing-lg);
				z-index: 85;
				.close-button-svg {
					width: 100%;
					height: 100%;
				}
			}

			.modal-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: var(--spacing-sm);

				.modal-title {
					width: 100%;
					text-align: center;
				}
			}

			.modal-body {
				flex: 1 1 auto;
				padding: var(--spacing-sm);
			}

			.modal-footer {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding: var(--spacing-sm);
			}
		}
	}
</style>
