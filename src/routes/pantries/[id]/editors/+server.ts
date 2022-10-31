import { PantryModel } from '$lib/db';
import { auth, getUid, hasAccessToPantry } from '$lib/firebase-admin';
import type { AddEditors, Id, Pantry } from '$lib/Pantry';
import type { RequestHandler } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import type { AddEditorRequest } from './types';

export const POST: RequestHandler = async (event) => {
  const { request, params } = event;
  const uid = await getUid(event);
  // Must be logged in
  if (!uid) return new Response(null, { status: 401 });

  const pantryDoc = await PantryModel.findById(params.id);
  if (!hasAccessToPantry(uid, pantryDoc))
    // Must have editor access to pantry
    return new Response(null, { status: 401 });

  const reqData = (await request.json()) as AddEditorRequest;
  // Find users
  const editorsToAdd: { uid: Id | null; email: string }[] = [];
  for (const userSearch of reqData.editorsToAdd) {
    // Find Firebase user by email
    const user = await auth.getUserByEmail(userSearch.email).catch(() => {
      // do nothing
    });

    // Add resolved UID if found, otherwise just add an allowed email for future signup
    if (user) editorsToAdd.push({ uid: user.uid, email: user.email });
    else editorsToAdd.push({ email: userSearch.email, uid: null });
  }

  for (const editor of editorsToAdd) {
    pantryDoc.editors.push(editor);
  }
  pantryDoc.editors = [...new Set(pantryDoc.editors)];

  const operation: AddEditors = {
    _id: nanoid(),
    opType: 'AddEditors',
    uid,
    timestamp: new Date(),
    data: { editorsToAdd }
  };
  pantryDoc.history.push(operation);
  console.log(pantryDoc);
  const result = await pantryDoc.save();
  return new Response(JSON.stringify(result));
};

export const DELETE: RequestHandler = async ({ params }) => {
  const pantry = await PantryModel.findById(params.id);
  pantry?.delete();
  return new Response(JSON.stringify(pantry));
};
