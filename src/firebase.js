import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDE3zLMmEAX6ICTB4d057L7W-v6lZZsPNI",
  authDomain: "market-jb.firebaseapp.com",
  projectId: "market-jb",
  storageBucket: "market-jb.firebasestorage.app",
  messagingSenderId: "881645854044",
  appId: "1:881645854044:web:f601e1597b192ee1ed7599"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
