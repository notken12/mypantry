<script lang="ts">
	import BackLink from './BackLink.svelte';
	
	import { user } from '$lib/stores';

$: signInText = $user ? `Signed in as ${$user?.displayName}` : 'Not signed in';

	export let href = '';
	export let backLink = true;
</script>

<header>
	{#if backLink}
		<BackLink {href} />
	{/if}
	<slot />
	<p>{signInText} </p>
</header>
