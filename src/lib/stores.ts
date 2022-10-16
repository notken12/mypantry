import { onAuthStateChanged, type User } from 'firebase/auth';
import { writable, type Writable } from 'svelte/store';
import { auth } from './firebase';

onAuthStateChanged(auth, (u) => {
  if (u) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    user.set(u);
  } else {
    // User is signed out
    // ...
    user.set(null);
  }
});

export const user: Writable<User | null> = writable(null);
