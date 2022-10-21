import { onAuthStateChanged, type User } from 'firebase/auth';
import { writable, type Writable } from 'svelte/store';
import { auth } from './firebase';
import Cookies from 'js-cookie';

onAuthStateChanged(auth, async (u) => {
  if (u) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    user.set(u);
    const token = await u.getIdToken(true);
    idToken.set(token);
    Cookies.set('firebaseIdToken', token, {});
  } else {
    // User is signed out
    // ...
    user.set(null);
  }
  loaded.set(true);
});

export const loaded = writable(false);
export const user: Writable<User | null> = writable(null);
export const idToken: Writable<string | null> = writable(null);
