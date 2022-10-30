<script lang="ts">
	import { invalidate } from '$app/navigation';

	import { fetchAuthed } from '$lib/fetch';
	import type { Pantry } from '$lib/Pantry';
	import { loaded, user } from '$lib/stores';

	import type { PageData } from './$types';

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

<main>
	<a href="../">Home</a>
	<h1>My Pantries</h1>
	<section>
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
	<p>{$user?.displayName ?? 'Not signed in'}</p>
</main>
