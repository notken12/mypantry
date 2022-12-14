import { PantryModel } from '$lib/db';
import { getUid } from '$lib/firebase-admin';
import type { CheckoutData, CheckoutItems, Id, NewItem } from '$lib/Pantry';
import type { RequestHandler } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const POST: RequestHandler = async (event) => {
  const { request, params } = event;
  const checkoutData = (await request.json()) as CheckoutData;
  //const uid = await getUid(event);
  //if (!uid) return new Response(null, { status: 401 });

  const pantryDoc = await PantryModel.findById(event.params.id);

  const operation: CheckoutItems = {
    _id: nanoid(),
    opType: 'CheckoutItems',
    timestamp: new Date(),
    uid: null,
    data: { ...checkoutData, approved: false, pending: true }
  };

  pantryDoc.history.push(operation);
  const result = await pantryDoc.save();
  return new Response(JSON.stringify(result));
};
