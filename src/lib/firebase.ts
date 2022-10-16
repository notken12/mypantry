import { initializeApp } from 'firebase/app';

import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyATx6txu6F9nUMkMZesSLehRNWwnQpxhnY',
  authDomain: 'my-pantry-cac.firebaseapp.com',
  projectId: 'my-pantry-cac',
  storageBucket: 'my-pantry-cac.appspot.com',
  messagingSenderId: '753895641475',
  appId: '1:753895641475:web:190de476001f0d1d8d26b6',
  measurementId: 'G-FP6C41DCWS'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
