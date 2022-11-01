import { PantryModel } from '$lib/db';
import { getUid, hasAccessToPantry } from '$lib/firebase-admin';
import type { EditItems, Id, Item, NewItem } from '$lib/Pantry';
import type { RequestHandler } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

/** Do POST /pantries with pantry data to create a new pantry */
export const POST: RequestHandler = async (event) => {
	const { request, params } = event;
	const itemData = (await request.json()) as Item;
	const uid = await getUid(event);
	if (!uid) return new Response(null, { status: 401 });

	const pantryDoc = await PantryModel.findById(params.id);
	if (!hasAccessToPantry(uid, pantryDoc)) return new Response(null, { status: 401 });
	pantryDoc.inventory.push({ ...itemData, _id: nanoid() });
	const operation: NewItem = {
		_id: nanoid(),
		opType: 'NewItem',
		uid,
		timestamp: new Date(),
		data: {
			item: itemData
		}
	};
	pantryDoc.history.push(operation);
	const result = await pantryDoc.save();
	return new Response(JSON.stringify(result));
};

export const PUT: RequestHandler = async (event) => {
	const { request, params } = event;
	const inventoryData = (await request.json()) as Item[];
	const uid = await getUid(event);
	if (!uid) return new Response(null, { status: 401 });

	const pantryDoc = await PantryModel.findById(params.id);
	if (!hasAccessToPantry(uid, pantryDoc)) return new Response(null, { status: 401 });

	const changes: Record<Id, Partial<Item>> = {};
	const old: Record<Id, Partial<Item>> = {};
	for (const item of inventoryData) {
		const existing = pantryDoc.inventory.find((i) => i._id === item._id);
		if (existing.amount != item.amount) {
			if (!changes[item._id]) changes[item._id] = {};
			if (!old[item._id]) old[item._id] = {};
			changes[item._id].amount = item.amount;
			old[item._id].amount = existing.amount;
		}
		if (existing.name != item.name) {
			if (!old[item._id]) old[item._id] = {};
			if (!changes[item._id]) changes[item._id] = {};
			old[item._id].name = existing.name;
			changes[item._id].name = item.name;
		}
		existing.name = item.name;
		existing.amount = item.amount;
	}
	if (!changes) return new Response(null, { status: 401 });
	const operation: EditItems = {
		_id: nanoid(),
		opType: 'EditItems',
		uid,
		timestamp: new Date(),
		data: {
			changes,
			old
		}
	};
	pantryDoc.history.push(operation);
	const result = await pantryDoc.save();
	return new Response(JSON.stringify(result));
};
