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
  const user = await auth.getUser(uid).catch((_) => {
    // do nothing
  });
  let serializeUser: object = user as object;
  if (user) serializeUser = user.toJSON();
  // clientAuth.updateCurrentUser(user);

  return {
    user: serializeUser as UserRecord
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
