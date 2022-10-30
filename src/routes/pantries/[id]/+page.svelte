<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import Modal from '$lib/Modal.svelte';

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
		// invalidate(`.`);
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
	const deletePantry = async (e: Event) => {
		e.preventDefault();
		if (confirmDelete == pantry.name || !pantry.name) {
			fetchAuthed(`/pantries/${pantry._id}`, {
				method: 'DELETE'
			}).then(() => {
				window.location.replace('../../dashboard');
			});
		} else confirmDelete = '';
	};
	let amountsToCheckOut: number[] = [];
	let qrCodeImage: HTMLImageElement;
	let editorStatus: boolean;
	let pantryInfoModal: Modal;
	let newItemModal: Modal;
	let shareModal: Modal;
	onMount(() => {
		/*QRCode.toDataURL(window.location.origin + `/pantries/${pantry._id}/checkout`, (e, url) => {
			qrCodeImage.src = url;
		});*/
		editorStatus = $user?.uid == pantry.owner; //edit this later for collaborators
	});

	const opTypes = {
		NewItem: 'New item',
		EditItems: 'Edit items',
		CheckoutItems: 'Checkout items',
		EditInfo: 'Edit pantry info'
	};
</script>

<main>
	<a href="/dashboard">Back to dashboard</a>
	<h1>{pantry.name ?? 'Unnamed pantry'}</h1>
	<p>{pantry.description ?? 'No description provided'}</p>
	<p>
		Owner: {users[pantry.owner]?.displayName}<br />
		Collaborators: soon
	</p>

	{#if editorStatus}
		<button on:click={pantryInfoModal.open}>Edit Pantry Info</button>
		<Modal title="Edit Pantry Info" bind:this={pantryInfoModal}>
			<form on:submit={editPantryDesc}>
				<input type="text" placeholder="New Pantry Name" bind:value={newPantryName} />
				<input type="text" placeholder="New Pantry Description" bind:value={newPantryDesc} />
				<input type="submit" value="Change" />
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
		</Modal>
	{/if}
	<h2>Items</h2>
	<ul>
		{#each pantry.inventory as item, i}
			{#if item.imageURL}
				<img src={item.imageURL?.href} alt={item.name + ' item image'} width="50" />
			{/if}
			<li>{item.name}: {item.amount}</li>
			<br />
		{/each}
	</ul>
	{#if editorStatus}
		<button on:click={newItemModal.open}>Add New Item</button>
		<Modal title="New Item" bind:this={newItemModal}>
			<form on:submit={newItem}>
				<input type="file" name="Image" accept="image/*" />
				<input type="text" placeholder="Item name" bind:value={newItemName} />
				<input type="number" placeholder="Amount" bind:value={amountOfItem} />
				<input type="submit" value="New item" />
			</form>
		</Modal>
	{/if}
	<div style="overflow-y:scroll;height:200px;overflow-x:hidden;">
		<h2>History</h2>
		<ul>
			{#each pantry.history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) as op}
				<li>
					<p>{opTypes[op.opType]}</p>
					{#if op.uid}
						<p>{users[op.uid].displayName}</p>
					{/if}
					{#if op.opType === 'NewItem'}
						<p>{op.data.item.name}</p>
					{:else if op.opType === 'EditInfo'}
						<p>Name: {op.data.newInfo.name}</p>
						<p>Description: {op.data.newInfo.description}</p>
					{:else if op.opType === 'CheckoutItems'}
						<div>
							{#if op.data.optionalInfo}
								<p>Request by {op.data.optionalInfo?.firstName} {op.data.optionalInfo?.lastName}</p>
								<p>Additional Remarks: {op.data.optionalInfo?.additionalRemarks}</p>
							{/if}
						</div>
						<p>{op.data.approved ? 'Approved' : 'Not approved'}</p>
						<ul>
							{#each Object.entries(op.data.itemAmounts) as [id, amount]}
								<li>
									{pantry.inventory.find((i) => i._id === id)?.name}: {amount}
								</li>
							{/each}
						</ul>
					{:else}
						<p>Cannot display, raw data: {JSON.stringify(op.data)}</p>
					{/if}
					<p>{new Date(op.timestamp).toLocaleString()}</p>
				</li>
			{/each}
		</ul>
	</div>
	<a href={`./${pantry._id}/checkout`}>Checkout items</a>
	<!--<button on:click={shareModal.open}>Share Checkout Page</button>
	<Modal title="Share" bind:this={shareModal}>
		<button on:click={() => navigator.clipboard.writeText(window.location.href)}>Copy link</button>
		<b>Scan me to checkout!</b>
		<img bind:this={qrCodeImage} alt="QR code" width="200" />
		<a href={qrCodeImage?.src} download>Download QRCode as image</a>
	</Modal>-->
</main>
