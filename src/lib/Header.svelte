<script lang="ts">
	import BackLink from './BackLink.svelte';

	export let href = '';
	export let backLink = true;
</script>

<header>
	{#if backLink}
		<BackLink {href} />
	{/if}
	<h1><slot /></h1>
</header>
