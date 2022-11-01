<script lang="ts">
	import { invalidate } from '$app/navigation';

	import type { UserRecord } from 'firebase-admin/lib/auth/user-record';
	import { fetchAuthed } from './fetch';

	import type { ApproveCheckout, CheckoutItems, Id, Operation, Pantry } from './Pantry';
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
		ApproveCheckout: 'Approve checkout'
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
		await fetchAuthed(`./${pantry._id}/checkout/approve`, {
			method: 'POST',
			body: JSON.stringify(operation)
		});
		invalidate(`./${pantry._id}`);
	};

	let approvedRequest: CheckoutItems;
	$: {
		if (op.opType === 'ApproveCheckout')
			approvedRequest = pantry.history.find((o) => o._id === op.data.requestOpId) as CheckoutItems;
	}

	const getName = (c: CheckoutItems) => {
		const info = c.data.optionalInfo;
		if (info?.firstName || info?.lastName) return `${info.firstName} ${info.lastName}`;
		return 'Anonymous';
	};
</script>

<li id={`history-${op._id}`}>
	{#if op.opType !== 'ApproveCheckout'}
		<h4>{opTypes[op.opType]}</h4>
		{#if op.uid}
			<p>{users[op.uid].displayName}</p>
		{/if}
	{/if}
	{#if op.opType === 'NewItem'}
		<p>{op.data.item.name}</p>
	{:else if op.opType === 'EditInfo'}
		<p>Name: {op.data.newInfo.name}</p>
		<p>Description: {op.data.newInfo.description}</p>
	{:else if op.opType === 'CheckoutItems'}
		<div>
			{#if op.data.optionalInfo}
				<p>Request by {getName(op)}</p>
				<p>Additional Remarks: {op.data.optionalInfo?.additionalRemarks}</p>
			{/if}
		</div>
		{#if op.data.pending}
			<p>Approval pending</p>
		{:else}
			<p>{op.data.approved ? 'Approved' : 'Not approved'}</p>
		{/if}
		{#if editorStatus && op.data.pending}
			<button on:click={() => approveCheckout(op._id, true)}>Approve request</button>
			<button on:click={() => approveCheckout(op._id, false)}>Deny request</button>
		{/if}
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
		<h4>
			{op.data.approvalStatus ? 'Approve' : 'Deny'} checkout
		</h4>
		<p>{users[op.uid].displayName}</p>
		<div>
			{op.data.approvalStatus ? 'Approved' : 'Deny'}
			<a href={`#history-${op.data.requestOpId}`}>request</a>
			by {getName(approvedRequest)}
		</div>
		<div>
			{#if approvedRequest.data.optionalInfo}
				<p>Additional Remarks: {approvedRequest.data.optionalInfo?.additionalRemarks}</p>
			{/if}
		</div>
		<ul>
			{#each Object.entries(approvedRequest.data.itemAmounts) as [id, amount]}
				<li>
					{pantry.inventory.find((i) => i._id === id)?.name}: {amount}
				</li>
			{/each}
		</ul>
		<!-- <ul> -->
		<!-- 	{#each Object.entries(op.data.checkoutData.itemAmounts) as [id, amount]} -->
		<!-- 		<li>{pantry.inventory.find((i) => i._id === id)?.name}: {amount}</li> -->
		<!-- 	{/each} -->
		<!-- </ul> -->
	{:else}
		<p>Cannot display, raw data: {JSON.stringify(op.data)}</p>
	{/if}
	<small><code>{new Date(op.timestamp).toLocaleString()}</code></small>
</li>
