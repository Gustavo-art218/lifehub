import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDx1h3DzucP1YPojMQWUQGadkzdLtNN2s",
  authDomain: "lifehub-92389.firebaseapp.com",
  projectId: "lifehub-92389",
  storageBucket: "lifehub-92389.firebasestorage.app",
  messagingSenderId: "33647496978",
  appId: "1:33647496978:web:9a91c0621cae10b035adcb",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);