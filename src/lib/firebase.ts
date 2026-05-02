import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "dummy",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "dummy",
  databaseURL: "https://dummy-project.firebaseio.com"
};

// Singleton pattern to ensure Firebase is only initialized once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firestore for structured data (Tasks, Meta)
export const db = getFirestore(app);

// Realtime Database is ideal for the high-frequency real-time chat between team members
export const rtdb = getDatabase(app);

export default app;
