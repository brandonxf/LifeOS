import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { db, getUserId } from '../firebase/config'
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'

export const useFirebaseSync = () => {
  const store = useStore()
  const userIdRef = useRef(getUserId())
  const syncTimeoutRef = useRef(null)

  const syncToFirebase = async () => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current)
    }
    
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        const data = store.getFullState()
        const userDoc = doc(db, 'users', userIdRef.current)
        await setDoc(userDoc, {
          ...data,
          updatedAt: new Date().toISOString()
        }, { merge: true })
        store.setSyncStatus(true)
        console.log('✓ Sincronizado con Firebase')
      } catch (error) {
        console.error('Error sincronizando:', error)
      }
    }, 2000)
  }

  const loadFromFirebase = async () => {
    try {
      const userDoc = doc(db, 'users', userIdRef.current)
      const snapshot = await getDoc(userDoc)
      
      if (snapshot.exists()) {
        const data = snapshot.data()
        store.loadFromFirebase(data)
        console.log('✓ Datos cargados desde Firebase')
      } else {
        store.setLoading(false)
      }
    } catch (error) {
      console.error('Error cargando desde Firebase:', error)
      store.setLoading(false)
    }
  }

  const subscribeToChanges = () => {
    const userDoc = doc(db, 'users', userIdRef.current)
    return onSnapshot(userDoc, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data()
        if (data.updatedAt) {
          store.loadFromFirebase(data)
        }
      }
    })
  }

  return { syncToFirebase, loadFromFirebase, subscribeToChanges }
}

export default function FirebaseSync({ children }) {
  const { syncToFirebase, loadFromFirebase, subscribeToChanges } = useFirebaseSync()
  const store = useStore()

  useEffect(() => {
    loadFromFirebase()
    const unsubscribe = subscribeToChanges()
    
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  useEffect(() => {
    const state = store.getFullState()
    if (Object.keys(state.waterData).length > 0 || 
        Object.keys(state.gymData).length > 0 ||
        Object.keys(state.sugarData).length > 0) {
      syncToFirebase()
    }
  }, [store.waterData, store.gymData, store.sugarData, store.routineData])

  if (store.isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-accent-green">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return children
}
