<script>
	import { loaded } from '$lib/stores';
</script>

<svelte:head>
	<style src="../app.css"></style>
</svelte:head>

{#if $loaded}
	<slot />
{:else}
	<p>Loading...</p>
{/if}
