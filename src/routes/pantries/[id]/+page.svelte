<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';

	import { fetchAuthed } from '$lib/fetch';

	import type { Pantry } from '$lib/Pantry';

	import type { PageData } from './$types';

	export let data: PageData;
	export let pantry: Pantry = data.pantry;
	export let users = data.users;

	let newItemName = '';
	let amountOfItem = 0;
	const newItem = async (e: Event) => {
		e.preventDefault();
		const name = newItemName;
		newItemName = '';
		const amount = amountOfItem;
		amountOfItem = 0;
		await fetchAuthed(`/pantries/${pantry._id}/inventory`, {
			method: 'POST',
			body: JSON.stringify({ name, amount })
		});
		// invalidate(`/pantries/${pantry._id}`);
		invalidateAll();
	};
	let newPantryName = '';
	let newPantryDesc = '';
	const editPantryDesc = async (e: Event) => {
		e.preventDefault();
		const name = newPantryName;
		newPantryName = '';
		const description = newPantryDesc;
		newPantryDesc = '';
		await fetchAuthed(`/pantries/${pantry._id}`, {
			method: 'POST',
			body: JSON.stringify({ name, description })
		});
		invalidateAll();
	};
	let confirmDelete = '';
	const deletePantry = async() => {
		if (confirmDelete == pantry.name || !pantry.name) {
			await fetchAuthed(`/pantries/${pantry._id}`, {
				method: 'DELETE',
			});
			invalidateAll();
			window.location.replace("../../dashboard");
		} else confirmDelete = '';
	}
</script>

<main>
	<a href="/dashboard">Back to dashboard</a>
	<form on:submit={deletePantry}>
		<legend style="color:red;">Delete Pantry</legend>
		<input type="text" placeholder="Type the name of this pantry to delete it" bind:value={confirmDelete} />
		<input type="submit" value="Delete" />
	</form>
	<h1>{pantry.name ?? 'Unnamed pantry'}</h1>
	<p>{pantry.description ?? 'No description provided'}</p>
	<form on:submit={editPantryDesc}>
		<input type="text" placeholder="New Pantry Name" bind:value={newPantryName} />
		<input type="text" name="new pantry description" placeholder="New Pantry Description" bind:value={newPantryDesc}>
		<input type="submit" value="Change" />
	</form>
	<p>
		Owner: {users[pantry.owner]?.displayName}<br>
		Owner Id: {pantry.owner}
	</p>
	<h2>Items</h2>
	<ul>
		{#each pantry.inventory as item}
			<li>{item.name}: {item.amount}</li>
		{/each}
	</ul>
	<form on:submit={newItem}>
		<input type="text" placeholder="Item name" bind:value={newItemName} />
		<input type="number" placeholder="Amount" bind:value={amountOfItem} />
		<input type="submit" value="New item" />
	</form>
</main>