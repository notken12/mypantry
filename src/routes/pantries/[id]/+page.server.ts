import { PantryModel } from '$lib/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const pantry = await PantryModel.findById(params.id);
  console.log(pantry);
  return { pantry: JSON.parse(JSON.stringify(pantry)) };
};
