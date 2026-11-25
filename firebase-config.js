// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBSjzb29zTMZ1iMw8eUXuNvpQrET97de98",
  authDomain: "andrey-4bcfa.firebaseapp.com",
  projectId: "andrey-4bcfa",
  storageBucket: "andrey-4bcfa.firebasestorage.app",
  messagingSenderId: "763896714887",
  appId: "1:763896714887:web:aad8fd6c528342a3fe0a22",
  measurementId: "G-GVD5LTP4CK"
};

const app = initializeApp(firebaseConfig);

// Exporta o Firestore para ser usado nos outros arquivos
export const db = getFirestore(app);
