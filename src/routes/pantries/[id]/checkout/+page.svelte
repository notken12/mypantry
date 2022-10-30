<script lang="ts">
	import type { Id, Pantry } from '$lib/Pantry';
	import type { UserRecord } from 'firebase-admin/lib/auth/user-record';
	import type { PageData } from './$types';

	export let data: PageData;
	let pantry: Pantry;
	$: pantry = data.pantry;
	let users: Record<Id, UserRecord>;
	$: users = data.users;

	let search:String;
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
	<p>{pantry.description}</p>
	<input type="text" placeholder="Search" bind:value={search}/>
	<ul>
		{#each pantry.inventory.filter(i => {
				if (!search) return i;
				return i.name.search(RegExp(`${search}`, 'i')) != -1
			}
		) as item,i}
			<li>
				<p>{item.name} ({item.amount} in stock)</p>
				<input bind:value={amounts[item._id]} min=0 max={item.amount} type="number" />
				<button on:click={() => amounts[item._id] != item.amount ? amounts[item._id]++ : 0}>Add</button>
				<button on:click={() => amounts[item._id] != 0 ? amounts[item._id]-- : 0}>Subtract</button>
			</li>
		{/each}
	</ul>
	<p>Optional: tell us a bit about yourself?</p>
	<input type="text" placeholder="First name" />
	<input type="text" placeholder="Last name" />
	<input type="text" placeholder="Additional remarks" />
	<button>Send Request</button>
</main>
