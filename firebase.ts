
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcO82nZxhBrrmN-sWRPik3QCxMDJcu880",
  authDomain: "nsultanrestaurant-46681.firebaseapp.com",
  projectId: "nsultanrestaurant-46681",
  storageBucket: "nsultanrestaurant-46681.firebasestorage.app",
  messagingSenderId: "874556532355",
  appId: "1:874556532355:web:68dc5e800e51d5b2e35db6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
