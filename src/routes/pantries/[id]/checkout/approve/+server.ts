import { PantryModel } from '$lib/db';
import { getUid, hasAccessToPantry } from '$lib/firebase-admin';
import type { ApproveCheckout, CheckoutData, Item, Operation, Pantry } from '$lib/Pantry';
import type { RequestHandler } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const POST: RequestHandler = async (event) => {
  const { request, params } = event;
  const opRequest = (await request.json()) as ApproveCheckout;
  const uid = await getUid(event);
  if (!uid) return new Response(null, { status: 401 });

  const pantryDoc = await PantryModel.findById(event.params.id);
  if (!hasAccessToPantry(uid, pantryDoc))
    // Must have editor access to pantry
    return new Response(null, { status: 401 });

  for 

  const operation: Operation = {
      _id: nanoid(),
      opType: 'ApproveCheckout',
      timestamp: new Date(),
      uid: null,
      data: { requestOpId: opRequest.data.requestOpId, approvalStatus: opRequest.data.approvalStatus }
    };
    console.log(pantryDoc, opRequest.inventory);
    pantryDoc.history.push(operation);
  const result = await pantryDoc.save();
  return new Response(JSON.stringify(result));
};
