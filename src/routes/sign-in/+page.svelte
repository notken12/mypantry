<script lang="ts">
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

	import { auth } from '$lib/firebase';
	import { idToken, user } from '$lib/stores';
	import Header from '$lib/Header.svelte';
	import { invalidateAll } from '$app/navigation';
	import Cookies from 'js-cookie';
	const provider = new GoogleAuthProvider();

	$: signInText = $user ? `Signed in as ${$user?.displayName}` : 'Not signed in';

	const signInWithGoogle = async () => {
		try {
			const result = await signInWithPopup(auth, provider);
			auth.updateCurrentUser(result.user);
			const token = await result.user.getIdToken(true);
			idToken.set(token);
			Cookies.set('firebaseIdToken', token, {});
			invalidateAll();
		} catch (e) {
			console.log(e);
		}
	};

	const signOut = async () => {
		await auth.signOut();
		Cookies.remove('firebaseIdToken');
		invalidateAll();
	};
</script>

<main>
	<Header href="../"><h1>Sign in</h1></Header>
	<button on:click={signInWithGoogle}>Sign in with Google</button>
	<button on:click={signOut}>Sign out</button>
</main>
