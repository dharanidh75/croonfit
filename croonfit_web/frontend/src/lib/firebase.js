import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app = null;
let auth = null;
let googleProvider = null;

try {
  // Only initialize if we actually have an API key, to prevent white screen crashes
  if (firebaseConfig.apiKey && firebaseConfig.apiKey.trim() !== '') {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } else {
    console.warn("Firebase is not initialized: VITE_FIREBASE_API_KEY is missing. Please add it to your .env.development file and restart the dev server.");
  }
} catch (e) {
  console.error("Failed to initialize Firebase:", e);
}

export { auth, googleProvider };
