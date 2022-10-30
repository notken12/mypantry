<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	import { fetchAuthed } from '$lib/fetch';

	import type { Pantry, Item } from '$lib/Pantry';
	import { user } from '$lib/stores';

	import type { PageData } from './$types';
	import * as QRCode from 'qrcode';
	import type { UserRecord } from 'firebase-admin/lib/auth/user-record';

	export let data: PageData;
	let pantry: Pantry;
	$: pantry = data.pantry;
	let users: Record<string, UserRecord>;
	$: users = data.users;

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
		invalidate(`.`);
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
	const deletePantry = async (e: Event) => {
		e.preventDefault();
		if (confirmDelete == pantry.name || !pantry.name) {
			await fetchAuthed(`/pantries/${pantry._id}`, {
				method: 'DELETE'
			});
			invalidateAll();
			window.location.replace('../../dashboard');
		} else confirmDelete = '';
	};
	let amountsToCheckOut: number[] = [];
	let qrCodeImage: HTMLImageElement;
	let editorStatus: boolean;
	onMount(() => {
		QRCode.toDataURL(window.location.href, (e, url) => {
			qrCodeImage.src = url;
		});
		editorStatus = $user?.uid == pantry.owner; //edit this later for collaborators
	});
</script>

<main>
	<a href="/dashboard">Back to dashboard</a>
	<h1>{pantry.name ?? 'Unnamed pantry'}</h1>
	<p>{pantry.description ?? 'No description provided'}</p>
	{#if editorStatus}
		<form on:submit={editPantryDesc}>
			<input type="text" placeholder="New Pantry Name" bind:value={newPantryName} />
			<input type="text" placeholder="New Pantry Description" bind:value={newPantryDesc} />
			<input type="submit" value="Change" />
		</form>
	{/if}
	<p>
		Owner: {users[pantry.owner]?.displayName}<br />
		Collaborators: LATER my gosh ken can you do this
	</p>
	<h2>Items</h2>
	<ul>
		{#each pantry.inventory as item, i}
			<img src={item.imageURL?.href} alt={item.name + ' item image'} width="50" />
			<li>{item.name}: {item.amount}</li>
			<input
				type="number"
				max={item.amount}
				min="0"
				placeholder="Amount to check out"
				bind:value={amountsToCheckOut[i]}
			/>
			<br />
		{/each}
	</ul>
	{#if editorStatus}
		<form on:submit={newItem}>
			<legend>New Item</legend>
			<input type="text" placeholder="Item name" bind:value={newItemName} />
			<input type="number" placeholder="Amount" bind:value={amountOfItem} />
			<input type="submit" value="New item" />
		</form>
	{/if}
	<form>
		<legend>Cart</legend>
		{#if amountsToCheckOut.filter(Boolean).length != 0}
			{#each pantry.inventory as cartItem, i}
				{#if amountsToCheckOut[i]}
					<img src={cartItem.imageURL?.href} alt={cartItem.name + ' item image'} width="50" />
					<li>{cartItem.name}: {amountsToCheckOut[i]}</li>
				{/if}
			{/each}
		{:else}
			<p>Nothing in cart currently!</p>
		{/if}
		<input type="submit" value="Check Out" />
	</form>
	{#if $user?.uid == pantry.owner}
		<!--this is only for owners-->
		<form on:submit={() => deletePantry}>
			<legend style="color:red;">Delete Pantry</legend>
			<input
				type="text"
				placeholder="Type the name of this pantry to delete it"
				bind:value={confirmDelete}
			/>
			<input type="submit" value="Delete" />
		</form>
	{/if}
	<div id="share">
		<h1>Share</h1>
		<button on:click={() => navigator.clipboard.writeText(window.location.href)}>Copy link</button>
		<img bind:this={qrCodeImage} alt="QR code" width="200" /><a href={qrCodeImage?.src} download
			>Download QRCode as image</a
		>
	</div>
</main>
