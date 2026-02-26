import React from 'react'
import { useStore } from './store/useStore'
import Navigation from './components/Navigation'
import FirebaseSync from './components/FirebaseSync'
import Dashboard from './modules/Dashboard'
import Water from './modules/Water'
import Gym from './modules/Gym'
import Sugar from './modules/Sugar'
import Meals from './modules/Meals'
import Sleep from './modules/Sleep'
import BodyMeasurements from './modules/BodyMeasurements'
import Routines from './modules/Routines'
import Analytics from './modules/Analytics'

const modules = {
  dashboard: Dashboard,
  water: Water,
  gym: Gym,
  sugar: Sugar,
  meals: Meals,
  sleep: Sleep,
  body: BodyMeasurements,
  routines: Routines,
  analytics: Analytics,
}

function App() {
  const { activeModule } = useStore()
  
  const ActiveModule = modules[activeModule] || Dashboard

  return (
    <FirebaseSync>
      <div className="min-h-screen bg-bg-primary">
        <Navigation />
        
        <main className="md:ml-64 min-h-screen">
          <div className="max-w-4xl mx-auto p-4 md:p-6">
            <ActiveModule />
          </div>
        </main>
      </div>
    </FirebaseSync>
  )
}

export default App
