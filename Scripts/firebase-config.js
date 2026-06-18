import { db } from './firebase-config.js'; // Asegúrate de que la ruta sea correcta
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBhGyKRRDL3EDHJYsi5nuQv6NC6AoMMtxw",
  authDomain: "edushare-6c6dc.firebaseapp.com",
  projectId: "edushare-6c6dc",
  storageBucket: "edushare-6c6dc.firebasestorage.app",
  messagingSenderId: "79794860583",
  appId: "1:79794860583:web:1be58b82ed5e77b9845402",
  measurementId: "G-Z4VSZRWPY0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // ¡Esta línea es obligatoria!
console.log("Firestore inicializado con el proyecto:", firebaseConfig.projectId); // Esto te dirá en consola si se exportó bien