// Scripts/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// (Opcional)
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBhGyKRRDL3EDHJYsi5nuQv6NC6AoMMtxw",
  authDomain: "edushare-6c6dc.firebaseapp.com",
  projectId: "edushare-6c6dc",
  storageBucket: "edushare-6c6dc.firebasestorage.app",
  messagingSenderId: "79794860583",
  appId: "1:79794860583:web:1be58b82ed5e77b9845402",
  measurementId: "G-Z4VSZRWPY0"
};

// Inicializar app
const app = initializeApp(firebaseConfig);

// 🔥 FIRESTORE (CLAVE)
const db = getFirestore(app);

// (Opcional)
const analytics = getAnalytics(app);

// 🔥 EXPORTAR
export { db };