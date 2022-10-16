<script lang="ts">
	import { invalidate } from '$app/navigation';

	import type { Pantry } from '$lib/Pantry';

	import type { PageData } from './$types';

	export let data: PageData;
	let pantries: Pantry[];
	$: pantries = data.pantries;

	let newPantryName: string;

	const newPantry = async (e: Event) => {
		e.preventDefault();
		const pantry = (await (
			await fetch('/pantries', { method: 'POST', body: JSON.stringify({ name: newPantryName }) })
		).json()) as Pantry;
		// location.assign(`/pantries/${pantry._id}`);
		invalidate('/pantries');
	};
</script>

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
	<input type="submit" value="GO" />
</form>
