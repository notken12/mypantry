<script lang="ts">
	import Header from '$lib/Header.svelte';
	import { user } from '$lib/stores';
	$: signInText = $user ? `Signed in as ${$user?.displayName}` : 'Not signed in';
</script>

<main>
	<Header href="../"><h1>About Us</h1></Header>
</main>
