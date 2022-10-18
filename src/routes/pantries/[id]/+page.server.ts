import { PantryModel } from '$lib/db';
import { auth, getUsers } from '$lib/firebase-admin';
import type { Id, Pantry } from '$lib/Pantry';
import { error } from '@sveltejs/kit';
import type { UserRecord } from 'firebase-admin/lib/auth/user-record';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const pantry = await PantryModel.findById(event.params.id);
  if (!pantry) throw error(404, 'pantry not found');
  const users = await getUsers([pantry.owner, ...pantry.editors]);
  return {
    pantry: JSON.parse(JSON.stringify(pantry)) as Pantry,
    users: JSON.parse(JSON.stringify(users))
  };
};
