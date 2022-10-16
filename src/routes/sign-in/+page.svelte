<script lang="ts">
	import { initializeApp } from 'firebase/app';

	import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
	// Your web app's Firebase configuration
	// For Firebase JS SDK v7.20.0 and later, measurementId is optional
	const firebaseConfig = {
		apiKey: 'AIzaSyATx6txu6F9nUMkMZesSLehRNWwnQpxhnY',
		authDomain: 'my-pantry-cac.firebaseapp.com',
		projectId: 'my-pantry-cac',
		storageBucket: 'my-pantry-cac.appspot.com',
		messagingSenderId: '753895641475',
		appId: '1:753895641475:web:190de476001f0d1d8d26b6',
		measurementId: 'G-FP6C41DCWS'
	};

	const app = initializeApp(firebaseConfig);
	const auth = getAuth(app);
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
