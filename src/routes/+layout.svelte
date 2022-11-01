<script lang="ts">
	import { idToken, loaded, user } from '$lib/stores';
	import { onAuthStateChanged } from 'firebase/auth';
	import Cookies from 'js-cookie';
	import { auth } from '$lib/firebase';
	import type { LayoutData } from './$types';
	import ProgressBar from 'svelte-progress-bar';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import type { UserRecord } from 'firebase-admin/lib/auth/user-record';

	export let data: LayoutData;
	let dataUser: UserRecord;
	$: dataUser = data.user;
	$: {
		user.set(dataUser);
		loaded.set(true);
	}

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
			Cookies.remove('firebaseIdToken');
		}
		loaded.set(true);
	});

	let progress: ProgressBar;

	beforeNavigate(() => {
		progress.start();
	});

	afterNavigate(() => {
		progress.complete();
	});
</script>

<svelte:head>
	<style src="../app.css"></style>
	<link
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
		rel="stylesheet"
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<ProgressBar bind:this={progress} color="var(--base08)" width="100%" />
{#if $loaded}
	<slot />
{:else}
	<p>Loading...</p>
{/if}
