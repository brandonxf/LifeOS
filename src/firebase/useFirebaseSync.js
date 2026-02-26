import { useState, useEffect, useCallback } from 'react'
import { db, signInAnon } from './config'
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'

const USER_ID_KEY = 'lifeos_user_id'

export const useFirebaseSync = () => {
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSynced, setIsSynced] = useState(false)

  // Inicializar usuario
  useEffect(() => {
    const initUser = async () => {
      // Buscar ID de usuario existente
      let existingId = localStorage.getItem(USER_ID_KEY)
      
      if (!existingId) {
        // Sign in anónimo y obtener ID
        const uid = await signInAnon()
        if (uid) {
          existingId = uid
          localStorage.setItem(USER_ID_KEY, uid)
        }
      }
      
      setUserId(existingId)
      setIsLoading(false)
    }

    initUser()
  }, [])

  // Guardar datos en Firestore
  const saveData = useCallback(async (data) => {
    if (!userId) return
    
    try {
      const userDoc = doc(db, 'users', userId)
      await setDoc(userDoc, {
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true })
      setIsSynced(true)
    } catch (error) {
      console.error("Error saving to Firebase:", error)
    }
  }, [userId])

  // Cargar datos desde Firestore
  const loadData = useCallback(async () => {
    if (!userId) return null
    
    try {
      const userDoc = doc(db, 'users', userId)
      const snapshot = await getDoc(userDoc)
      
      if (snapshot.exists()) {
        return snapshot.data()
      }
      return null
    } catch (error) {
      console.error("Error loading from Firebase:", error)
      return null
    }
  }, [userId])

  // Sincronización en tiempo real
  const subscribeToChanges = useCallback((callback) => {
    if (!userId) return () => {}
    
    const userDoc = doc(db, 'users', userId)
    const unsubscribe = onSnapshot(userDoc, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data())
      }
    })
    
    return unsubscribe
  }, [userId])

  return {
    userId,
    isLoading,
    isSynced,
    saveData,
    loadData,
    subscribeToChanges
  }
}
