<script lang="ts">
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

	import { auth } from '$lib/firebase';
	import { user } from '$lib/stores';
	import Header from '$lib/Header.svelte';
	const provider = new GoogleAuthProvider();

	$: signInText = $user ? `Signed in as ${$user?.displayName}` : 'Not signed in';

	const signInWithGoogle = async () => {
		try {
			const result = await signInWithPopup(auth, provider);
			auth.updateCurrentUser(result.user);
		} catch (e) {
			console.log(e);
		}
	};
</script>

<main>
	<Header href="../">Sign in</Header>
	<button on:click={signInWithGoogle}>Sign in with Google</button>
</main>
