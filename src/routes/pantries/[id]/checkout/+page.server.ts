import { PantryModel } from '$lib/db';
import { getUid, getUsers } from '$lib/firebase-admin';
import type { Id, Pantry } from '$lib/Pantry';
import { error } from '@sveltejs/kit';
import type { UserRecord } from 'firebase-admin/lib/auth/user-record';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  event.depends(`/pantries/${event.params.id}`);
  event.depends(`/pantries/${event.params.id}/inventory`);

  const pantry = await PantryModel.findById(event.params.id);
  if (!pantry) throw error(404, 'pantry not found');

  // const uid = await getUid(event);
  // const usersToGet = [pantry.owner];
  // if (uid != null) usersToGet.push(uid);
  // for (const editor of pantry.editors) {
  //   if (editor.uid) usersToGet.push(editor.uid);
  // }
  // const users = await getUsers(usersToGet);
  return {
    pantry: JSON.parse(JSON.stringify(pantry)) as Pantry
    // users: JSON.parse(JSON.stringify(users)) as Record<Id, UserRecord>
  };
};
