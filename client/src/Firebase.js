// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-8ea9f.firebaseapp.com",
  projectId: "mern-estate-8ea9f",
  storageBucket: "mern-estate-8ea9f.appspot.com",
  messagingSenderId: "43555319264",
  appId: "1:43555319264:web:bd6fed0553c2a9e37f0f85"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);