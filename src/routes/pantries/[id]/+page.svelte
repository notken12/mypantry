<script lang="ts">
	import type { Pantry } from '$lib/Pantry';

	import type { PageData } from './$types';

	export let data: PageData;
	export let pantry: Pantry = data.pantry;
</script>

<main>
	<a href="/dashboard">Back to dashboard</a>
	<h1>{pantry.name ?? 'Unnamed pantry'}</h1>
	<p>
		Owner: {pantry.owner}
	</p>
	<h2>Items</h2>
	<ul>
		{#each pantry.inventory as item}
			<li>{item.name}</li>
		{/each}
	</ul>
	<form>
		<input type="text" placeholder="Item name" />
		<input type="submit" value="New item" />
	</form>
</main>
