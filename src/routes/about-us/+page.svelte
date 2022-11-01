<script lang="ts">
	import Header from '$lib/Header.svelte';
	import { user } from '$lib/stores';
	$: signInText = $user ? `Signed in as ${$user?.displayName}` : 'Not signed in';
</script>

<main>
	<Header href="../"><h1>About Us</h1></Header>
	<p>MyPantry was made for the Congressional App Challenge in 2022.</p>
	<p>By Ken Zhou and Kavin Velmurugan</p>
	<a href="https://github.com/notken12/mypantry">Source code on GitHub</a>
</main>
