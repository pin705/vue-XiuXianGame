// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAnZjGQY4pjb4xVIHzKPZzIYXpZ567LQCI',
  authDomain: 'vue-idle.firebaseapp.com',
  projectId: 'vue-idle',
  storageBucket: 'vue-idle.firebasestorage.app',
  messagingSenderId: '731336875418',
  appId: '1:731336875418:web:fbbee2c2abe9ace84eee23',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app)

export { auth, db, onAuthStateChanged, signInAnonymously };
