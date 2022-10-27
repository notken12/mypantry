import { PantryModel } from '$lib/db';
import type { Pantry } from '$lib/Pantry';
import type { RequestHandler } from '@sveltejs/kit';
import { getUid } from '$lib/firebase-admin';

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
  const itemData = (await request.json()) as Pantry;
  const uid = await getUid(event);
  if (!uid) return new Response(null, { status: 401 });

  const pantryDoc = await PantryModel.findById(params.id);
  if (pantryDoc?.owner !== uid && !pantryDoc?.editors.find((e) => e === uid))
    return new Response(null, { status: 401 });
  pantryDoc
  const result = await pantryDoc.save();
  return new Response(JSON.stringify(result));
  
}