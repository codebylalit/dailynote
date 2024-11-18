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
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGfnAsDgooGn1NOY5Ufc1HONlmPuEi4XM",
  authDomain: "hotels-4d2cd.firebaseapp.com",
  projectId: "hotels-4d2cd",
  storageBucket: "hotels-4d2cd.firebasestorage.app",
  messagingSenderId: "423871600790",
  appId: "1:423871600790:web:a26b7beece2662802b8ab7",
  measurementId: "G-20PBDM4SGY",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
export { db, collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query,
  where };
