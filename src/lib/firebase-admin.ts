// Server side Firebase
import { initializeApp } from 'firebase-admin/app';
import { FIREBASE_ADMIN_CONFIG } from '$env/static/private';
import admin, { credential } from 'firebase-admin';
import type { Id } from './Pantry';
import type { UserRecord } from 'firebase-admin/lib/auth/user-record';

const serviceAccount = JSON.parse(FIREBASE_ADMIN_CONFIG);
export const app = initializeApp({
  credential: credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});
export const auth = admin.auth();

export const getUid = async (request: Request) => {
  const idToken = request.headers.get('firebaseIdToken');
  if (!idToken) return null;
  const token = await auth.verifyIdToken(idToken).catch(console.error);
  return token?.uid;
};

export const getUsers = async (uids: Id[]) => {
  const users: Record<Id, UserRecord> = {};
  for (const uid of uids) {
    users[uid] = await auth.getUser(uid);
  }
  return users;
};
