<script lang="ts">
	import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';

	import { auth } from '$lib/firebase';
	const provider = new GoogleAuthProvider();

	let signInText = 'Loading...';

	onAuthStateChanged(auth, (user) => {
		if (user) {
			// User is signed in, see docs for a list of available properties
			// https://firebase.google.com/docs/reference/js/firebase.User
			const uid = user.uid;
			signInText = 'Signed in as ' + (auth.currentUser?.displayName || '(no name)');
			// ...
		} else {
			// User is signed out
			// ...
			signInText = 'Not signed in';
		}
	});

	const signInWithGoogle = async () => {
		try {
			const result = await signInWithPopup(auth, provider);
			auth.updateCurrentUser(result.user);
			console.log(result);
		} catch (e) {
			console.log(e);
		}
	};
</script>

<main>
	<button on:click={signInWithGoogle}>Sign in with Google</button>
	<h2>{signInText}</h2>
</main>
