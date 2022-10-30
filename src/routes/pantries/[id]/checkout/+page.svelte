<script lang="ts">
	import type { Id, Pantry } from '$lib/Pantry';
	import type { UserRecord } from 'firebase-admin/lib/auth/user-record';
	import type { PageData } from './$types';

	export let data: PageData;
	let pantry: Pantry;
	$: pantry = data.pantry;
	let users: Record<Id, UserRecord>;
	$: users = data.users;

	let amounts: Record<Id, number> = {};
	$: {
		for (const item of pantry.inventory) {
			amounts[item._id] ??= 0;
		}
	}
</script>

<main>
	<a href=".">Back</a>
	<h1>Checkout items</h1>
	<h2>{pantry.name}</h2>
	<ul>
		{#each pantry.inventory as item}
			<li>
				<p>{item.name}</p>
				<input bind:value={amounts[item._id]} type="number" />
				<button on:click={() => amounts[item._id]++}>Add</button>
				<button on:click={() => amounts[item._id]--}>Subtract</button>
			</li>
		{/each}
	</ul>
	<button>Done</button>
</main>
