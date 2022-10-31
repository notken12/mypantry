import { PantryModel } from '$lib/db';
import { auth, getUid, getUsers } from '$lib/firebase-admin';
import type { Pantry } from '$lib/Pantry';
import { error } from '@sveltejs/kit';
import type { UserRecord } from 'firebase-admin/lib/auth/user-record';
import type { LayoutServerLoad } from './$types';
import { auth as clientAuth } from '$lib/firebase';
import { loaded, user } from '$lib/stores';
import { onAuthStateChanged, type User } from 'firebase/auth';

export const load: LayoutServerLoad = async (event) => {
  event.depends(`/pantries/${event.params.id}`);
  event.depends(`/pantries/${event.params.id}/inventory`);

  const uid = await getUid(event);
  const pantry = await PantryModel.findById(event.params.id);
  if (!pantry) throw error(404, 'pantry not found');
  const user = await auth.getUser(uid);
  // clientAuth.updateCurrentUser(user);

  return {
    pantry: JSON.parse(JSON.stringify(pantry)) as Pantry,
    user: user.toJSON() as UserRecord
    // users: JSON.parse(JSON.stringify(users)) as Record<Id, UserRecord>
  };

  // const uid = await getUid(event);
  // const usersToGet = [pantry.owner];
  // if (uid != null) usersToGet.push(uid);
  // for (const editor of pantry.editors) {
  //   if (editor.uid) usersToGet.push(editor.uid);
  // }
  // const users = await getUsers(usersToGet);
};
