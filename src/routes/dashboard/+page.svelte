<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';

	import { fetchAuthed } from '$lib/fetch';
	import type { Pantry } from '$lib/Pantry';
	import { loaded, user } from '$lib/stores';

	import type { PageData } from './$types';

	import Header from '$lib/Header.svelte';
	export let data: PageData;
	let pantries: Pantry[];
	$: pantries = data.pantries;


	let newPantryName: string;
	let newPantryDescription: string;

	const newPantry = async (e: Event) => {
		e.preventDefault();
		const name = newPantryName;
		newPantryName = '';
		const description = newPantryDescription;
		newPantryDescription = '';
		const pantry = (await (
			await fetchAuthed('/pantries', { method: 'POST', body: JSON.stringify({ name, description }) })
		).json()) as Pantry;
		invalidate('/pantries');
		window.location.assign(`/pantries/${pantry._id}`);
	};
</script>

<svelte:head>
	<title>Dashboard - MyPantry</title>
</svelte:head>

<main>
	<Header href="./"><h1>Dashboard</h1></Header>


	<section>
		<h2>My Pantries</h2>
		<ul>
			{#each pantries as pantry}
				<li>
					<a href={`/pantries/${pantry._id}`}>{pantry.name || 'Unnamed pantry'}</a>
				</li>
			{/each}
		</ul>
	</section>
	<form on:submit={newPantry}>
		<legend>New pantry</legend>
		<input type="text" name="name" placeholder="Name" bind:value={newPantryName} />
		<input type="text" name="description" placeholder="Description" bind:value={newPantryDescription} />
		<input type="submit" value="GO" />
	</form>
</main>
