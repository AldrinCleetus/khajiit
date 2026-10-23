import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin SDK
const app = admin.initializeApp({
  projectId: 'khajiit-market-7832',
});

export const auth = getAuth(app);
export const storage = getStorage(app);
