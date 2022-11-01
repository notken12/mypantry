<script lang="ts">
	import { fetchAuthed } from '$lib/fetch';
	import Header from '$lib/Header.svelte';
	import type { CheckoutData, Id, Pantry } from '$lib/Pantry';
	import type { UserRecord } from 'firebase-admin/lib/auth/user-record';
	import type { PageData } from './$types';

	export let data: PageData;
	let pantry: Pantry;
	$: pantry = data.pantry;
	// let users: Record<Id, UserRecord>;
	//$: users = data.users;

	let search: string;
	let amounts: Record<Id, number> = {};
	$: {
		for (const item of pantry.inventory) {
			amounts[item._id] ??= 0;
		}
	}

	let optionalInfo = {
		firstName: '',
		lastName: '',
		additionalRemarks: ''
	};

	const postCheckout = async () => {
		const checkoutData: CheckoutData = {
			optionalInfo,
			itemAmounts: amounts,
			approved: false,
			pending: true
		};
		await fetchAuthed(`./checkout`, {
			method: 'POST',
			body: JSON.stringify(checkoutData)
		});
		window.location.assign(window.location.origin + `/pantries/${pantry._id}`)
	};
</script>

<main>
	<Header href="."><h1>Checkout items</h1></Header>
	<h2>{pantry.name ?? 'Unnamed pantry'}</h2>
	<p>{pantry.description ?? 'No description provided'}</p>
	<input type="text" placeholder="Search" bind:value={search} />
	<ul>
		{#each pantry.inventory.filter((i) => {
			if (!search) return i;
			return i.name.search(RegExp(`${search}`, 'i')) != -1;
		}) as item, _i}
			<li>
				<p>{item.name} ({item.amount} in stock)</p>
				<input bind:value={amounts[item._id]} min="0" max={item.amount} type="number" />
				<button on:click={() => (amounts[item._id] != item.amount ? amounts[item._id]++ : 0)}
					>+</button
				>
				<button on:click={() => (amounts[item._id] != 0 ? amounts[item._id]-- : 0)}>-</button>
			</li>
		{/each}
	</ul>
	<p>Optional: tell us a bit about yourself?</p>
	<input type="text" placeholder="First name" bind:value={optionalInfo.firstName} />
	<input type="text" placeholder="Last name" bind:value={optionalInfo.lastName} />
	<input type="text" placeholder="Additional remarks" bind:value={optionalInfo.additionalRemarks} />
	<button on:click={postCheckout}>Send Request</button>
</main>
