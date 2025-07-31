// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnTuA6_Ytwd176rUIdjCuDyNxkYX5K_JA",
  authDomain: "dailynote-43ec8.firebaseapp.com",
  projectId: "dailynote-43ec8",
  storageBucket: "dailynote-43ec8.firebasestorage.app",
  messagingSenderId: "21378421730",
  appId: "1:21378421730:web:a3da88e1b0572033ea1fbb",
  measurementId: "G-C4KLWG8JNM",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
export {
  db,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
};
