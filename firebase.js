// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage"; // ✅ Import Storage


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3Rx7Qrb69S3S2KVQ54B_yus0r-EYlRR8",
  authDomain: "ecommerce-1-d7e63.firebaseapp.com",
  projectId: "ecommerce-1-d7e63",
  storageBucket: "ecommerce-1-d7e63.firebasestorage.app",
  messagingSenderId: "526066501855",
  appId: "1:526066501855:web:894cabf0aba0fbf201016a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services and export them
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
export default app;
export const storage = getStorage(app); // ✅ Export Storage
