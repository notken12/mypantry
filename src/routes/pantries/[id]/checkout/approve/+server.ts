import { PantryModel } from '$lib/db';
import { getUid, hasAccessToPantry } from '$lib/firebase-admin';
import type {
  ApproveCheckout,
  CheckoutData,
  CheckoutItems,
  Item,
  Operation,
  Pantry
} from '$lib/Pantry';
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

  const requested = pantryDoc.history.find(
    (v) => v._id == opRequest.data.requestOpId
  ) as CheckoutItems;
  if (!requested) return new Response(null, { status: 400 });

  requested.data.approved = opRequest.data.approvalStatus;
  requested.data.pending = false;

  if (opRequest.data.approvalStatus) {
    // Find the request to approve and subtract the items from pantry's inventory
    const checkoutAmounts = requested.data.itemAmounts;
    for (const itemId in checkoutAmounts) {
      const item = pantryDoc.inventory.find((v) => v._id == itemId);
      item.amount -= checkoutAmounts[itemId];

      if (item.amount < 0) return new Response(null, { status: 400 });
    }
  }

  const operation: Operation = {
    _id: nanoid(),
    opType: 'ApproveCheckout',
    timestamp: new Date(),
    uid,
    data: { requestOpId: opRequest.data.requestOpId, approvalStatus: opRequest.data.approvalStatus }
  };

  pantryDoc.history.push(operation);
  const result = await pantryDoc.save();
  return new Response(JSON.stringify(result));
};
