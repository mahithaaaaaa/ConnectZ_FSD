// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from  "firebase/firestore"
import { getAnalytics } from "firebase/analytics";
import { getStorage } from  'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const VARIABLE_NAME = import.meta.env.VITE_GOOGLE_API_KEY;

const firebaseConfig = {
  apiKey: VARIABLE_NAME,
  authDomain: "linkedin-clone-3511b.firebaseapp.com",
  projectId: "linkedin-clone-3511b",
  storageBucket: "linkedin-clone-3511b.appspot.com",
  messagingSenderId: "618649638066",
  appId: "1:618649638066:web:eeb495c49d117b057065ab",
  measurementId: "G-GY1CN8J55B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { app, auth, firestore, storage };