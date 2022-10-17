import { idToken } from './stores';

let token: string | null;

idToken.subscribe((v) => (token = v));

export const fetchAuthed = (url: string, init?: RequestInit) => {
  if (token != null)
    return fetch(url, {
      headers: {
        firebaseIdToken: token
      },
      ...init
    });
  throw new Error('Not signed in, firebase ID token is missing');
};
