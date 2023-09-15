import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyDuh8671aZU8gXTBsw6Oywc5XC_wzYZSsA",
  authDomain: "real-time-chat-2b1ba.firebaseapp.com",
  databaseURL: "https://real-time-chat-2b1ba-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "real-time-chat-2b1ba",
  storageBucket: "real-time-chat-2b1ba.appspot.com",
  messagingSenderId: "271878951279",
  appId: "1:271878951279:web:d7684f83393a00db1b189a",
  measurementId: "G-G50KRTDDDJ"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const database = firebase.database();

const handleError = (error) => {
  console.error('Firebase Error:', error);
};

export { handleError };
