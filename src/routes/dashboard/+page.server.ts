import { getAllPantries } from '../pantries/+server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const pantries = await getAllPantries();
	return {
		pantries: JSON.parse(JSON.stringify(pantries))
	};
};
