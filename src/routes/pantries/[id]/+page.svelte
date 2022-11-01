<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Modal from '$lib/Modal.svelte';

	import { fetchAuthed } from '$lib/fetch';

	import type { Pantry } from '$lib/Pantry';
	import { user } from '$lib/stores';

	import type { PageData } from './$types';
	import * as QRCode from 'qrcode';
	import type { UserRecord } from 'firebase-admin/lib/auth/user-record';
	import { browser } from '$app/environment';
	import type { AddEditorRequest } from './editors/types';
	import Header from '$lib/Header.svelte';
	import Operation from '$lib/Operation.svelte';

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
	let newPantryLocation = '';
	const editPantryDesc = async (e: Event) => {
		e.preventDefault();
		const name = newPantryName;
		newPantryName = '';
		const description = newPantryDesc;
		newPantryDesc = '';
		const location = newPantryLocation;
		newPantryLocation = '';
		await fetchAuthed(`/pantries/${pantry._id}`, {
			method: 'POST',
			body: JSON.stringify({ name, description, location })
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
	$: editorStatus =
		pantry.editors.find((e) => e.uid === $user?.uid || e.email === $user?.email) != null;
	let pantryInfoModal: Modal;
	let newItemModal: Modal;
	let shareModal: Modal;
	let editItemsModal: Modal;
	let addCollaboratorsModal: Modal;

	$: {
		if (browser && qrCodeImage)
			QRCode.toDataURL(window.location.origin + `/pantries/${pantry._id}/checkout`, (_e, url) => {
				qrCodeImage.src = url;
			});
	}

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
		await fetchAuthed(`./${pantry._id}/editors`, {
			method: 'POST',
			body: JSON.stringify(req)
		});
		invalidateAll();
	};

	const editItems = async () => {
		await fetchAuthed(`/pantries/${pantry._id}/inventory`, {
			method: 'PUT',
			body: JSON.stringify(pantry.inventory)
		});
		invalidateAll();
	};
</script>

<main>
	<Header href="/dashboard"><h1>{pantry.name ?? 'Unnamed pantry'}</h1></Header>
	<div id="info">
		<p>{pantry.description ?? 'No description provided'}</p>
		{#if pantry.location} <p>{pantry.location}</p> {/if}
		<br />
		<ul>
			<small>Collaborators:</small>
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
			<button on:click={() => navigator.clipboard.writeText(window.location.href)}>Copy link</button
			>
			<b>Scan me to checkout! Idea: you can print this QR code and put it up at your pantry for easy access to checkout.</b>
			<img bind:this={qrCodeImage} alt="QR code" width="200" />
			<a href={qrCodeImage?.src} download>Download QRCode as image</a>
		</Modal>
	</div>
	<div id="editor">
		<h2>Edit pantry</h2>
		{#if editorStatus}
			<button on:click={addCollaboratorsModal.open}> Add collaborators </button>
			<button on:click={pantryInfoModal.open}>Edit Pantry Info</button>
			<Modal title="Edit Pantry Info" bind:this={pantryInfoModal}>
				<form on:submit={editPantryDesc}>
					<input type="text" placeholder="New Pantry Name" bind:value={newPantryName} />
					<input type="text" placeholder="New Pantry Description" bind:value={newPantryDesc} />
					<input type="text" name="Pantry Location" bind:value={newPantryLocation} />
					<input type="submit" value="Change" />
				</form>

				{#if $user?.uid == pantry.owner}
					<!--this is only for owners-->
					<form on:submit={(e) => deletePantry(e)}>
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
	</div>
	<div id="items">
		<h2>Items</h2>
		<ul>
			{#each pantry.inventory as item, _i}
				<li>{item.name}: {item.amount}</li>
			{/each}
		</ul>
		{#if editorStatus}
			<button on:click={newItemModal.open}>Add New Item</button>
			<Modal title="New Item" bind:this={newItemModal}>
				<form on:submit={newItem}>
					<input type="text" placeholder="Item name" bind:value={newItemName} />
					<input type="number" placeholder="Amount" bind:value={amountOfItem} />
					<input type="submit" value="New item" />
				</form>
			</Modal>
			<button on:click={editItemsModal.open}>Edit items</button>
			<Modal title="Edit items" bind:this={editItemsModal} on:done={editItems}>
				<p>Edit items by changing the inputs for their names and quantities.</p>
				<ul>
					{#each pantry.inventory as item, _i}
						<li>
							<input type="text" bind:value={item.name} placeholder="Item name" />
							<input type="number" min="0" bind:value={item.amount} placeholder="Quantity" />
						</li>
					{/each}
				</ul>
			</Modal>
		{/if}
	</div>
	<div id="history">
		<h2>History</h2>
		<ul>
			{#each pantry.history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) as op}
				<Operation {op} {pantry} {users} {editorStatus} />
			{/each}
		</ul>
	</div>
</main>
