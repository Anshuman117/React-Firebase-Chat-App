import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "reactchatapp-35108.firebaseapp.com",
    projectId: "reactchatapp-35108",
    storageBucket: "reactchatapp-35108.firebasestorage.app",
    messagingSenderId: "973398563621",
    appId: "1:973398563621:web:b4b04d5fa66743426f18cc"
  };

  const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()








