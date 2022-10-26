import { PantryModel } from '$lib/db';
import { auth, getUid } from '$lib/firebase-admin';
import type { Id } from '$lib/Pantry';
import type { Actions, RequestHandler } from '@sveltejs/kit';

export const getAllPantries = async () => {
  return await PantryModel.find();
};

/** Get the pantries a user has access to */
export const getUserPantries = async (uid: Id) => {
  return await PantryModel.find({ $or: [{ owner: uid }, { editors: uid }] });
};

/** Do GET /pantries to get all pantries in the world */
export const GET: RequestHandler = async () => {
  const allPantries = await getAllPantries();
  return new Response(JSON.stringify(allPantries));
};

/** Do POST /pantries with pantry data to create a new pantry */
export const POST: RequestHandler = async (event) => {
  const { request } = event;
  const pantryData = await formDataOrJson(request);
  const uid = await getUid(event);
  if (!uid) return new Response(null, { status: 401 });

  const pantryDoc = new PantryModel({ owner: uid, editors: [uid], ...pantryData });
  return new Response(JSON.stringify(await pantryDoc.save()));
};

//export const PUT: RequestHandler = async (event) => {


//}
//export const DELETE: RequestHandler = async (event) => {


//}

const formDataOrJson = async (request: Request): Promise<Record<string, unknown>> => {
  const text = await request.text();
  return JSON.parse(text);
};

// export const actions: Actions = {
//   default: async (event) => {
//     const pantryData = await event.request.formData();
//     console.log(pantryData);
//     // const pantryData = event.params;
//     const pantryDoc = new PantryModel(pantryData);
//     return new Response(JSON.stringify(await pantryDoc.save()));
//   }
// };
