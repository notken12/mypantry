import { PantryModel } from '$lib/db';
import type { EditInfo, Pantry } from '$lib/Pantry';
import type { RequestHandler } from '@sveltejs/kit';
import { auth, getUid } from '$lib/firebase-admin';
import { nanoid } from 'nanoid';

/** Do GET /pantries/[id] to get the pantry with that ID */
export const GET: RequestHandler = async ({ params }) => {
	const pantry = await PantryModel.findById(params.id);
	return new Response(JSON.stringify(pantry));
};

/** TODO: Do DELETE /pantries/[id] to delete the pantry with that ID */
/* export const DELETE: RequestHandler = async ({ params }) => { */
/* }; */
export const POST: RequestHandler = async (event) => {
	const { request, params } = event;
	const pantryData = (await request.json()) as Pantry;
	const uid = await getUid(event);
	if (!uid) return new Response(null, { status: 401 });

	const pantryDoc = await PantryModel.findById(params.id);
	let email = (await auth.getUser(uid)).email;
  	if (pantryDoc?.owner !== uid && !pantryDoc?.editors.find(e => e.uid === uid || e.email === email))
    	return new Response(null, { status: 401 });
	pantryDoc.set(pantryData);
	const operation: EditInfo = {
		_id: nanoid(),
		opType: 'EditInfo',
		uid,
		timestamp: new Date(),
		data: {
			newInfo: pantryData
		}
	};
	pantryDoc.history.push(operation);
	const result = await pantryDoc.save();
	return new Response(JSON.stringify(result));
};

export const DELETE: RequestHandler = async ({ params }) => {
	const pantry = await PantryModel.findById(params.id);
	pantry?.delete();
	return new Response(JSON.stringify(pantry));
};
