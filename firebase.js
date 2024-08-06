// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAigr3IciADGfAwQ1MmU7e3m0OEctqEd-o",
  authDomain: "inventory-management-app-49f33.firebaseapp.com",
  projectId: "inventory-management-app-49f33",
  storageBucket: "inventory-management-app-49f33.appspot.com",
  messagingSenderId: "146695702207",
  appId: "1:146695702207:web:2b217555b2539c918ce80a",
  measurementId: "G-45BVJ22B2Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);
export { app, firestore };
