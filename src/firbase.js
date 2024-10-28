// Importa las funciones que necesitas del SDK de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Para autenticación
import { getFirestore } from "firebase/firestore";  // Para Firestore
import { getStorage } from "firebase/storage"; // Para almacenamiento (opcional)

// Configuración de Firebase (usa variables de entorno)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios que vas a utilizar
export const auth = getAuth(app);  // Autenticación
export const db = getFirestore(app);  // Firestore
export const storage = getStorage(app);  // Almacenamiento (si lo necesitas)

export default app;
