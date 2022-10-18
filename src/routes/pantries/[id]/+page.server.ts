import { PantryModel } from '$lib/db';
import { getUsers } from '$lib/firebase-admin';
import type { Pantry } from '$lib/Pantry';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  event.depends(`/pantries/${event.params.id}`);

  const pantry = await PantryModel.findById(event.params.id);
  if (!pantry) throw error(404, 'pantry not found');
  const users = await getUsers([pantry.owner, ...pantry.editors]);
  return {
    pantry: JSON.parse(JSON.stringify(pantry)) as Pantry,
    users: JSON.parse(JSON.stringify(users))
  };
};
