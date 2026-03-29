// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCb1mcIeea9H6XK2VMK96yjnNNUNW8b_Ec",
//   authDomain: "real-estate-f5358.firebaseapp.com",
//   projectId: "real-estate-f5358",
//   storageBucket: "real-estate-f5358.firebasestorage.app",
//   messagingSenderId: "130481024133",
//   appId: "1:130481024133:web:21d1bcb6c8857d9fa78dec"
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);

// firebase.js
import { initializeApp } from "firebase/app";

// Use env variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const missingFirebaseVars = Object.entries(firebaseConfig).filter(([_, val]) => !val);
if (missingFirebaseVars.length > 0) {
  console.error('Missing Firebase env vars:', missingFirebaseVars.map(([key]) => key).join(', '));
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);