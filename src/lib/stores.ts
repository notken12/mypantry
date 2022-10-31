import { onAuthStateChanged, type User } from 'firebase/auth';
import { writable, type Writable } from 'svelte/store';
import { auth } from './firebase';
import Cookies from 'js-cookie';
import type { UserRecord } from 'firebase-admin/lib/auth/user-record';

export const loaded = writable(false);
export const user: Writable<UserRecord | null> = writable(null);
export const idToken: Writable<string | null> = writable(null);
