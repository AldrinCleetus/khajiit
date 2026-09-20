import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "fairtrade-market-7832",
  appId: "1:294199347490:web:10f7831fb10237550cbd7b",
  storageBucket: "fairtrade-market-7832.firebasestorage.app",
  apiKey: "AIzaSyB6xYcyjtvmOsBeeUIuFqqqTsVNCE6fuO8",
  authDomain: "fairtrade-market-7832.firebaseapp.com",
  messagingSenderId: "294199347490",
  projectNumber: "294199347490",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);
