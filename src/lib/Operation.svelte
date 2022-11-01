<script lang="ts">
	import type { UserRecord } from 'firebase-admin/lib/auth/user-record';
	import { fetchAuthed } from './fetch';

	import type { ApproveCheckout, Id, Operation, Pantry } from './Pantry';
	import { user } from './stores';

	export let op: Operation;
	export let users: Record<string, UserRecord>;
	export let pantry: Pantry;
	export let editorStatus: boolean;

	const opTypes = {
		NewItem: 'New item',
		EditItems: 'Edit items',
		CheckoutItems: 'Checkout items',
		EditInfo: 'Edit pantry info',
		AddEditors: 'Add collaborators',
		ApproveCheckout: 'Approve Checkout'
	};

	const approveCheckout = async (requestOpId: Id, approvalStatus: boolean) => {
		const operation: ApproveCheckout = {
			opType: 'ApproveCheckout',
			uid: $user.uid,
			data: {
				requestOpId,
				approvalStatus
			}
		};
		await fetchAuthed(window.location.href + '/checkout/approve', {
			method: 'POST',
			body: JSON.stringify(operation)
		});
	};
</script>

<li>
	<h4>{opTypes[op.opType]}</h4>
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
		{#if editorStatus}<button on:click={() => approveCheckout(op.data)}>
				Approve Request</button
			>{/if}
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
	{:else if op.opType === 'ApproveCheckout'}
		<div>
			{op.data.approvalStatus ? 'Approved' : 'Canceled'} request by {pantry.history.find(
				(o) => o._id === op.data.requestOpId
			)?.uid}
		</div>
		<ul>
			{#each Object.entries(op.data.checkoutData.itemAmounts) as [id, amount]}
				<li>{pantry.inventory.find((i) => i._id === id)?.name}: {amount}</li>
			{/each}
		</ul>
	{:else}
		<p>Cannot display, raw data: {JSON.stringify(op.data)}</p>
	{/if}
	<small><code>{new Date(op.timestamp).toLocaleString()}</code></small>
</li>
