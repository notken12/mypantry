<script lang="ts">
	import Header from '$lib/Header.svelte';
	import type { Pantry } from '$lib/Pantry';
	import Icon from '@iconify/svelte';
	let query: string;

	let searchResults: Pantry[] = [];
	const search = async (e: Event) => {
		e.preventDefault();
		const params = new URLSearchParams();
		params.append('q', query );
		const results = await (await fetch('/search?' + params.toString())).json() as Pantry[];
		searchResults = results;
	};
</script>

<main>
	<Header backLink={false}
		><h1>MyPantry</h1>
</Header>
<banner>
	<h2>Pantries for all your needs ❤</h2>

	<form on:submit={(e) => search(e)}>
		<div class="material-symbols-outlined">Search</div>
		<input type="text" placeholder="Search" bind:value={query} />

		<ul id="searchResults">
			{#each searchResults as result} <li>
				<a href={`/pantries/${result._id}`}>{result.name}</a>
				</li>{/each}
		</ul>
	</form></banner>
	<a href="/dashboard">Dashboard</a>
	<a href="/sign-in">Sign In</a>
	<a href="/about-us">About Us</a>
</main>
