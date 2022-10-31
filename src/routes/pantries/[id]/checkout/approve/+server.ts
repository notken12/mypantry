import { PantryModel } from '$lib/db';
import { getUid } from '$lib/firebase-admin';
import type { ApproveCheckout, CheckoutData, Item, Pantry} from '$lib/Pantry';
import type { RequestHandler } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const POST: RequestHandler = async (event) => {
	const { request, params } = event;
	const data = (await request.json()) as {newData: CheckoutData, inventory: Item[]};
	//const uid = await getUid(event);
	//if (!uid) return new Response(null, { status: 401 });

	const pantryDoc = await PantryModel.findById(event.params.id);

	const operation: ApproveCheckout = {
		_id: nanoid(),
		opType: 'ApproveCheckout',
		timestamp: new Date(),
		uid:null,
		data: {checkoutData:data.newData, approvalStatus: true }
	};
	pantryDoc.inventory = data.inventory;
	console.log(pantryDoc, data.inventory)
	pantryDoc.history.push(operation);
	const result = await pantryDoc.save();
	return new Response(JSON.stringify(result));
};
