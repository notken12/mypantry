<script lang="ts">
	import Header from '$lib/Header.svelte';
	import type { Pantry } from '$lib/Pantry';
	let query: string;

	let searchResults: Pantry[] = [];
	const search = async (e: Event) => {
		e.preventDefault();
		const params = new URLSearchParams();
		params.append('q', query );
		console.log(params.toString())
		const results = await (await fetch('/search?' + params.toString())).json() as Pantry[];
		searchResults = results;
		console.log(searchResults);
	};
</script>

<main>
	<Header backLink={false}
		><h1>MyPantry</h1>
</Header>
	<h2>Pantries for all your needs ❤</h2>

	<form on:submit={(e) => search(e)}>
		<input type="text" placeholder="Search for pantries" bind:value={query} />

		<ul>
			{#each searchResults as result} <li>
				<a href={`/pantry/${result._id}`}>{result.name}</a>
				</li>{/each}
		</ul>
	</form>
	<a href="/dashboard">Dashboard</a>
	<a href="/sign-in">Sign In</a>
	<a href="/about-us">About Us</a>
</main>
