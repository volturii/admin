// firebase-config.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD67hcKrDTHGeW30e5KwsxIfw3cFc82Wnw",
  authDomain: "localhos",
  projectId: "stronamakaron",
  storageBucket: "stronamakaron.appspot.com",
  messagingSenderId: "481194687354",
  appId: "1:481194687354:web:69e692a5508f15d21e34c3",
  measurementId: "G-9K2461DJGY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export firestore instance
export const db = getFirestore(app);
