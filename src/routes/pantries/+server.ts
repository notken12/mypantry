import { PantryModel } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export const getAllPantries = async () => {
  return await PantryModel.find();
};

/** Do GET /pantries to get all pantries in the world */
export const GET: RequestHandler = async () => {
  const allPantries = await getAllPantries();
  return new Response(JSON.stringify(allPantries));
};

/** Do POST /pantries with pantry data to create a new pantry */
export const POST: RequestHandler = async ({ request }) => {
  const pantryData = await formDataOrJson(request);
  console.log(pantryData);
  // const pantryData = event.params;
  const pantryDoc = new PantryModel(pantryData);
  return new Response(JSON.stringify(await pantryDoc.save()));
};

const formDataOrJson = async (request: Request): Promise<Record<string, unknown>> => {
  const text = await request.text();
  return JSON.parse(text);
};
