import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBhcqQ_LXGV7WB5nyRyFmeWJXpDgQOf9Dk",
  authDomain: "interview-practice-344fe.firebaseapp.com",
  projectId: "interview-practice-344fe",
  storageBucket: "interview-practice-344fe.firebasestorage.app",
  messagingSenderId: "461739633858",
  appId: "1:461739633858:web:974faf289108eea7e11f5b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);