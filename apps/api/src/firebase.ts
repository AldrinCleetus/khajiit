import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// Providing the projectId is enough for verifyIdToken to work locally.
// For full admin access to Firestore/Storage, you will need a service account key.
admin.initializeApp({
  projectId: 'fairtrade-market-7832',
});

export const auth = admin.auth();
export const storage = admin.storage();
