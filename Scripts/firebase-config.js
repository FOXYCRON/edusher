// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-yNEkoj6iJx8-oOH0MihUiImcpGOH6g0",
  authDomain: "edushare-bd04c.firebaseapp.com",
  projectId: "edushare-bd04c",
  storageBucket: "edushare-bd04c.firebasestorage.app",
  messagingSenderId: "616607968503",
  appId: "1:616607968503:web:19512e45961bd3d35b77f2",
  measurementId: "G-4RN8SSF2GY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);