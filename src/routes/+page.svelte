<script lang="ts">
	import Header from '$lib/Header.svelte';
	import type { Pantry } from '$lib/Pantry';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	let query: string;

	let searchResults: Pantry[] = [];

	const getAllPantries = async () => {
		const results = (await (await fetch('/pantries')).json()) as Pantry[];
		searchResults = results;
	};

	const search = async (e: Event) => {
		e.preventDefault();
		const params = new URLSearchParams();
		params.append('q', query);
		const results = (await (await fetch('/search?' + params.toString())).json()) as Pantry[];
		searchResults = results;
	};

	onMount(() => {
		getAllPantries();
	});
</script>

<main>
	<Header backLink={false} signInLink={true}><h1>MyPantry</h1></Header>
	<banner>
		<h2>Discover pantries for all your needs ❤</h2>

		<form on:submit={(e) => search(e)}>
			<!-- <div class="material-symbols-outlined">Search</div> -->
			<input type="text" placeholder="Search" bind:value={query} />
		</form>
		<ul id="searchResults">
			{#each searchResults as result}
				<li>
					<a href={`/pantries/${result._id}`}>
						<div>
							<p>
								{result.name}
							</p>
							{#if result.description}
								<p>{result.description}</p>
							{/if}
							{#if result.address}
								<p><span class="material-symbols-outlined">pin_drop</span> {result.address}</p>
							{/if}
						</div>
					</a>
				</li>{/each}
		</ul>
	</banner>
	<section>
		<h2>Want to easily manage your own pantry?</h2>
		<a href="/dashboard">Create them here in your own dashboard!</a>
		<a href="/about-us">Learn more about our team.</a>
		<a href="https://github.com/notken12/mypantry">Source code on GitHub</a>
	</section>
</main>

<style>
	banner,
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		gap: 16px;
		padding: 16px;
	}
	#searchResults {
		height: 50vh;
		overflow-y: auto;
	}
</style>
