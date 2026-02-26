import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

// CONFIGURACIÓN DE FIREBASE - Life OS
const firebaseConfig = {
  apiKey: "AIzaSyBiEI-XPgvDESKZxGYhoqtBc9p275h-pfE",
  authDomain: "lifeos-e67b4.firebaseapp.com",
  projectId: "lifeos-e67b4",
  storageBucket: "lifeos-e67b4.firebasestorage.app",
  messagingSenderId: "724585332611",
  appId: "1:724585332611:web:b29988cf939900a9bc00b6",
  measurementId: "G-S6MPSHHWYS"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Servicios
export const db = getFirestore(app)
export const auth = getAuth(app)
export const analytics = getAnalytics(app)

// Función para autenticación anónima
export const signInAnon = async () => {
  try {
    const result = await signInAnonymously(auth)
    return result.user.uid
  } catch (error) {
    console.error("Error signing in anonymously:", error)
    return null
  }
}

// ID del usuario (se guarda localmente)
const USER_ID_KEY = 'lifeos_user_id'

export const getUserId = () => {
  let userId = localStorage.getItem(USER_ID_KEY)
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem(USER_ID_KEY, userId)
  }
  return userId
}
