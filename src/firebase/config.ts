import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase yapılandırması doğrudan tanımlanmış
const firebaseConfig = {
  apiKey: "AIzaSyDainJytfyn_E1eKDK1_jynBJvULmHn7lw",
  authDomain: "survey-4fa3d.firebaseapp.com",
  projectId: "survey-4fa3d",
  storageBucket: "survey-4fa3d.firebasestorage.app",
  messagingSenderId: "986118444786",
  appId: "1:986118444786:web:e6d88024a333e440cb626b",
  measurementId: "G-R1WV8V9CC8",
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firestore veritabanını al
const db = getFirestore(app);

// Analytics'i başlat - client tarafında çalışacak şekilde
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, db, analytics };
