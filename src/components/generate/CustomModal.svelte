<script>
	export let open = false
	export let closeCustomModal = () => {}
</script>

{#if open === true}
	<div class="modal">
		<div class="modal-content">
			<div class="modal-header">
				<h2>Custom Sparks</h2>
				<button on:click={closeCustomModal}>X</button>
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
	}

	.modal-content {
		width: 50%;
		height: 50%;
		background-color: white;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
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

	@media (max-width: 480px) {
		.modal-content {
			width: 100%;
			height: 100%;
		}
	}
</style>
