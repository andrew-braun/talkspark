<script lang="ts">
	export let link: string = "#"
</script>

<a href={link} class="nav-link">
	<slot />
</a>
