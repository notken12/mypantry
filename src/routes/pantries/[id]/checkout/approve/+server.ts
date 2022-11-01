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
  let requested = pantryDoc.history.find(v => v._id == opRequest.data.requestOpId);
  let checkoutAmounts = Object(requested.data.itemAmounts);
  for (let item in checkoutAmounts) {
    pantryDoc.inventory.find(v => v._id == item).amount -= checkoutAmounts[item];

    if (pantryDoc.inventory.find(v => v._id == item).amount < 0) return new Response(null, { status: 400 });
  };
  requested.data.approved = true;
  console.log(requested)
  

  const operation: Operation = {
      _id: nanoid(),
      opType: 'ApproveCheckout',
      timestamp: new Date(),
      uid: null,
      data: { requestOpId: opRequest.data.requestOpId, approvalStatus: opRequest.data.approvalStatus }
    };
    pantryDoc.history.push(operation);
  const result = await pantryDoc.save();
  console.log(pantryDoc.history)
  return new Response(JSON.stringify(result));
};
