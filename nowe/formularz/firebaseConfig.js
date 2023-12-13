// Wklej tutaj konfigurację Firebase z Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyD67hcKrDTHGeW30e5KwsxIfw3cFc82Wnw",
  authDomain: "localhost",
  databaseURL: "https://stronamakaron-default-rtdb.firebaseio.com",
  projectId: "stronamakaron",
  storageBucket: "stronamakaron.appspot.com",
  messagingSenderId: "481194687354",
  appId: "1:481194687354:web:69e692a5508f15d21e34c3",
  measurementId: "G-9K2461DJGY"
};

// Inicjalizacja Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
