<script>
	import { fade } from "svelte/transition"
	import Close from "lib/assets/icons/Close.svg?component"
	import Button from "components/buttons/Button.svelte"
	import ActionButton from "components/buttons/ActionButtons/ActionButton.svelte"

	export let open = false
	export let closeCustomModal = () => {}
</script>

{#if open === true}
	<div class="modal" transition:fade>
		<div class="modal-content">
			<div class="modal-header">
				<h2>Custom Sparks</h2>
				<span class="close-button">
					<ActionButton onClick={closeCustomModal} type="utility" title="">
						<span class="close-button-svg"><Close /></span>
					</ActionButton>
				</span>
			</div>
			<div class="modal-body">
				<p>Custom Sparks</p>
			</div>
			<div class="modal-footer" />
		</div>
	</div>
{/if}

<style lang="scss">
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;

		.modal-content {
			width: 50%;
			height: 50%;
			background-color: white;
			border-radius: 10px;
			display: flex;
			flex-direction: column;

			@media (max-width: 480px) {
				width: 100%;
				height: 100%;
			}

			.modal-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 1rem;

				.close-button {
					.close-button-svg {
						width: 100%;
						height: 100%;
					}
				}
			}

			.modal-body {
				flex: 1 1 auto;
				padding: 1rem;
			}

			.modal-footer {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding: 1rem;
			}
		}
	}
</style>
