import { getUid } from '$lib/firebase-admin';
import { redirect } from '@sveltejs/kit';
import { getUserPantries } from '../pantries/+server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const { depends, request, cookies } = event;
  depends('/pantries');

  const uid = await getUid(event);
  if (!uid) throw redirect(302, '/sign-in');

  const pantries = await getUserPantries(uid);
  return {
    pantries: JSON.parse(JSON.stringify(pantries))
  };
};
