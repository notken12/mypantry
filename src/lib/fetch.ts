import { idToken } from './stores';

let token: string | null;

idToken.subscribe((v) => (token = v));

export const fetchAuthed = (url: string, init?: RequestInit) => {
	return fetch(url, {
		headers: {
			firebaseIdToken: token
		},
		...init
	});
};
