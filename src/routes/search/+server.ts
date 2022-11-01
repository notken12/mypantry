import { PantryModel } from '$lib/db';
import type { Actions, RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
    const params = event.url.searchParams;
    const pantries = await PantryModel.find({$text: {$search: params.get('q')}})
    return new Response(JSON.stringify(pantries));
  };