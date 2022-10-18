<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';

	import { fetchAuthed } from '$lib/fetch';

	import type { Pantry } from '$lib/Pantry';

	import type { PageData } from './$types';

	export let data: PageData;
	export let pantry: Pantry = data.pantry;
	export let users = data.users;

	let newItemName = '';
	const newItem = async (e: Event) => {
		e.preventDefault();
		const name = newItemName;
		newItemName = '';
		await fetchAuthed(`/pantries/${pantry._id}/inventory`, {
			method: 'POST',
			body: JSON.stringify({ name })
		});
		// invalidate(`/pantries/${pantry._id}`);
		invalidateAll();
	};
</script>

<main>
	<a href="/dashboard">Back to dashboard</a>
	<h1>{pantry.name ?? 'Unnamed pantry'}</h1>
	<p>
		Owner: {users[pantry.owner]?.displayName}
		{pantry.owner}
	</p>
	<h2>Items</h2>
	<ul>
		{#each pantry.inventory as item}
			<li>{item.name}</li>
		{/each}
	</ul>
	<form on:submit={newItem}>
		<input type="text" placeholder="Item name" bind:value={newItemName} />
		<input type="submit" value="New item" />
	</form>
</main>
