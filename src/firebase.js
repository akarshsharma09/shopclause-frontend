// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB904kTi9ZTgM4rF8x743LF9TNyljMxarM",
  authDomain: "shopcluesclone-17b2e.firebaseapp.com",
  projectId: "shopcluesclone-17b2e",
  storageBucket: "shopcluesclone-17b2e.appspot.com",  // ✅ fixed here
  messagingSenderId: "579258971151",
  appId: "1:579258971151:web:1078d9a81d367d8e6b5f7a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);