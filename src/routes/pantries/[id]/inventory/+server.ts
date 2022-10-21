import { PantryModel } from '$lib/db';
import { getUid } from '$lib/firebase-admin';
import type { Item } from '$lib/Pantry';
import type { RequestHandler } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

/** Do POST /pantries with pantry data to create a new pantry */
export const POST: RequestHandler = async (event) => {
  const { request, params } = event;
  const itemData = (await request.json()) as Item;
  const uid = await getUid(event);
  if (!uid) return new Response(null, { status: 401 });

  const pantryDoc = await PantryModel.findById(params.id);
  if (pantryDoc?.owner !== uid && !pantryDoc?.editors.find((e) => e === uid))
    return new Response(null, { status: 401 });
  pantryDoc.inventory.push({ ...itemData, _id: nanoid() });
  const result = await pantryDoc.save();
  return new Response(JSON.stringify(result));
};
