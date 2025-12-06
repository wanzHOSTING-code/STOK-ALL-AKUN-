import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNZm2wnMwTiBDc6Q6bSHETTqyMK76BvLQ",
  authDomain: "stok-akun-789c3.firebaseapp.com",
  projectId: "stok-akun-789c3",
  storageBucket: "stok-akun-789c3.appspot.com",
  messagingSenderId: "931036833340",
  appId: "1:931036833340:web:27be67f802bee512e00539"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
