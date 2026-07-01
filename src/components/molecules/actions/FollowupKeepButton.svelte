<script lang="ts">
	import ActionButton from './ActionButton.svelte';
	import { keptFollowups } from 'stores/followups.svelte';
	import type { Followup } from 'ts/followup';

	import BiBookmarkHeart from 'lib/assets/icons/BiBookmarkHeart.svg?component';
	import BiBookmarkHeartFill from 'lib/assets/icons/BiBookmarkHeartFill.svg?component';

	let { followup }: { followup: Followup } = $props();

	let isKept = $derived(keptFollowups.isKept(followup.id));

	const handleKeepClick = () => {
		if (isKept) {
			keptFollowups.remove(followup.id);
		} else {
			keptFollowups.keep(followup);
		}
	};
</script>

<ActionButton onClick={handleKeepClick} title="Keep this follow-up" type="save">
	{#if isKept}
		<BiBookmarkHeartFill />
	{:else}
		<BiBookmarkHeart />
	{/if}
</ActionButton>
