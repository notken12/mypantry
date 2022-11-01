<script lang="ts">
	import BackLink from './BackLink.svelte';

	import { user } from '$lib/stores';

	$: signInText = $user ? `Signed in as ${$user?.displayName}` : 'Not signed in';

	export let href = '';
	export let backLink = true;
	export let signInLink = false;
</script>

<header>
	{#if backLink}
		<BackLink {href} />
	{/if}
	<slot />
	{#if !signInLink || $user}
		<p>{signInText}</p>
	{:else}
		<a href="/sign-in">Sign In</a>
	{/if}
</header>
