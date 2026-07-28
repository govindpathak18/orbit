// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "orbit-4fd6a.firebaseapp.com",
  projectId: "orbit-4fd6a",
  storageBucket: "orbit-4fd6a.firebasestorage.app",
  messagingSenderId: "732382304471",
  appId: "1:732382304471:web:760f8421db8a414c8f3892",
  measurementId: "G-P0PEK7VCJ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();