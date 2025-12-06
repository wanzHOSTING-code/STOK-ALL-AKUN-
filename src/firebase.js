import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDE3zLMmEAX6ICTB4d057L7W-v6lZZsPNI",
  authDomain: "market-jb.firebaseapp.com",
  projectId: "market-jb",
  storageBucket: "market-jb.firebasestorage.app",
  messagingSenderId: "881645854044",
  appId: "1:881645854044:web:f601e1597b192ee1ed7599"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage }; // <--- ini harus satu line, tidak boleh duplikat
