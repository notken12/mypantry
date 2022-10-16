import { PantryModel } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

/** Do GET /pantries/[id] to get the pantry with that ID */
export const GET: RequestHandler = async ({ params }) => {
  const pantry = await PantryModel.findById(params.id);
  return new Response(JSON.stringify(pantry));
};

/** TODO: Do DELETE /pantries/[id] to delete the pantry with that ID */
/* export const DELETE: RequestHandler = async ({ params }) => { */
/* }; */
