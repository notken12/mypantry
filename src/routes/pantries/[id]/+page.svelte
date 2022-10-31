<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Modal from '$lib/Modal.svelte';

	import { fetchAuthed } from '$lib/fetch';

	import type { Pantry, Operation } from '$lib/Pantry';
	import { user } from '$lib/stores';

	import type { PageData } from './$types';
	import * as QRCode from 'qrcode';
	import type { UserRecord } from 'firebase-admin/lib/auth/user-record';
	import { browser } from '$app/environment';
	import type { AddEditorRequest } from './editors/types';
	import Header from '$lib/Header.svelte';

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
	let qrCodeImage: HTMLImageElement;
	$: editorStatus = pantry.editors.find((e) => e.uid === $user?.uid || e.email === $user?.email);
	let pantryInfoModal: Modal;
	let newItemModal: Modal;
	let shareModal: Modal;
	let addCollaboratorsModal: Modal;

	$: {
		if (browser && qrCodeImage)
			QRCode.toDataURL(window.location.origin + `/pantries/${pantry._id}/checkout`, (e, url) => {
				qrCodeImage.src = url;
			});
	}

	const opTypes = {
		NewItem: 'New item',
		EditItems: 'Edit items',
		CheckoutItems: 'Checkout items',
		EditInfo: 'Edit pantry info',
		AddEditors: 'Add collaborators',
		ApproveCheckout: 'Approve Checkout'
	};

	let editorsToAdd: { email: string }[] = [];
	let editorInput: HTMLInputElement;
	const addEditorEmail = async () => {
		if (editorInput.checkValidity()) editorsToAdd.push({ email: editorInput.value });
		editorsToAdd = editorsToAdd;
		console.log(editorsToAdd);
	};

	const submitAddEditors = async () => {
		if (editorsToAdd.length === 0) return;
		const req: AddEditorRequest = { editorsToAdd };
		await fetchAuthed(window.location.href + '/editors', {
			method: 'POST',
			body: JSON.stringify(req)
		});
		invalidateAll();
	};
	const approveCheckout = async (e: Event, op: Operation) => {
		let newData = op.data;
		newData.approved = true;
		await fetchAuthed(window.location.href + '/checkout/approve', {
			method: 'POST',
			body: JSON.stringify(newData)
		});
	};
</script>

<main>
	<Header href="/dashboard">{pantry.name ?? 'Unnamed pantry'}</Header>
	<p>{pantry.description ?? 'No description provided'}</p>
	<p>Collaborators:</p>
	<ul>
		{#each pantry.editors as editor}
			<li>
				{editor.email}{editor.uid != null
					? ` (${users[editor.uid]?.displayName})`
					: ''}{pantry.owner === editor.uid ? ' (Owner)' : ''}
			</li>
		{/each}
	</ul>
	<a href={`./${pantry._id}/checkout`}>Checkout items</a>
	<button on:click={shareModal.open}>Share Checkout Page</button>
	<Modal title="Share" bind:this={shareModal}>
		<button on:click={() => navigator.clipboard.writeText(window.location.href)}>Copy link</button>
		<b>Scan me to checkout!</b>
		<img bind:this={qrCodeImage} alt="QR code" width="200" />
		<a href={qrCodeImage?.src} download>Download QRCode as image</a>
	</Modal>

	{#if editorStatus}
		<button on:click={addCollaboratorsModal.open}> Add collaborators </button>
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
		<Modal title="Add collaborators" bind:this={addCollaboratorsModal} on:done={submitAddEditors}>
			<ul>
				{#each editorsToAdd as editor}
					<li>{editor.email}</li>
				{/each}
			</ul>
			<form on:submit|preventDefault={addEditorEmail}>
				<input type="email" placeholder="Email" bind:this={editorInput} />
				<button type="submit">Add</button>
			</form>
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
						{#if editorStatus}<button on:click={(e) => approveCheckout(e, op)} />{/if}
						<ul>
							{#each Object.entries(op.data.itemAmounts) as [id, amount]}
								<li>
									{pantry.inventory.find((i) => i._id === id)?.name}: {amount}
								</li>
							{/each}
						</ul>
					{:else if op.opType === 'AddEditors'}
						<ul>
							{#each op.data.editorsToAdd as editor}
								<li>
									{editor.email}{editor.uid != null ? ` (${users[editor.uid]?.displayName})` : ''}
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
</main>
