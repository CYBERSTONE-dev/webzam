import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC046lbTrT_ckTAqNMfoQc6OMa9pq-YrGs",
  authDomain: "drcheapcart.firebaseapp.com",
  projectId: "drcheapcart",
  storageBucket: "drcheapcart.firebasestorage.app",
  messagingSenderId: "178907424175",
  appId: "1:178907424175:web:21cd505b8e57d7b65ffb5a"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
