<script lang="ts">
	import { idToken, loaded, user } from '$lib/stores';
	import { onAuthStateChanged, type User } from 'firebase/auth';
	import Cookies from 'js-cookie';
	import { auth } from '$lib/firebase';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	let dataUser = data.user;
	user.set(dataUser);
	loaded.set(true);

	onAuthStateChanged(auth, async (u) => {
		if (u) {
			// User is signed in, see docs for a list of available properties
			// https://firebase.google.com/docs/reference/js/firebase.User
			const token = await u.getIdToken(true);
			idToken.set(token);
			Cookies.set('firebaseIdToken', token, {});
		} else {
			// User is signed out
			// ...
			user.set(null);
		}
		loaded.set(true);
	});
</script>

<svelte:head>
	<style src="../app.css"></style>
</svelte:head>

{#if $loaded}
	<slot />
{:else}
	<p>Loading...</p>
{/if}
