import { create } from 'zustand'

// Utils
const getToday = () => new Date().toISOString().split('T')[0]

const generateId = () => Math.random().toString(36).substr(2, 9)

const defaultMorningRoutine = [
  { id: '1', text: 'Despertar temprano', completed: false },
  { id: '2', text: 'Ejercicio / Estiramiento', completed: false },
  { id: '3', text: 'Ducha fría', completed: false },
  { id: '4', text: 'Desayuno saludable', completed: false },
  { id: '5', text: 'Revisar objetivos del día', completed: false },
]

const defaultNightRoutine = [
  { id: '1', text: 'Revisar el día', completed: false },
  { id: '2', text: 'Preparar mañana', completed: false },
  { id: '3', text: 'Leer 30 minutos', completed: false },
  { id: '4', text: 'Meditar', completed: false },
  { id: '5', text: 'Dormir temprano', completed: false },
]

export const useStore = create((set, get) => ({
  // Navigation
  activeModule: 'dashboard',
  setActiveModule: (module) => set({ activeModule: module }),

  // Sync status
  isSynced: false,
  lastSynced: null,
  isLoading: true,
  setSyncStatus: (synced) => set({ isSynced: synced, lastSynced: new Date().toISOString() }),
  setLoading: (loading) => set({ isLoading: loading }),

  // Settings
  settings: {
    waterGoal: 2500,
    userName: 'Brandon',
    theme: 'dark', // 'light', 'dark', 'auto'
    notifications: {
      water: true,
      meal: false,
      sleep: false,
      gym: false,
    },
    notificationIntervals: {
      water: 120, // minutes
      meal: 360, // minutes
    },
    userInfo: {
      weight: null,
      height: null,
      age: null,
      gender: null, // 'male', 'female', 'other'
    },
  },
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),
  updateNotificationSettings: (notifications) => set((state) => ({
    settings: { ...state.settings, notifications: { ...state.settings.notifications, ...notifications } }
  })),
  updateNotificationIntervals: (intervals) => set((state) => ({
    settings: { ...state.settings, notificationIntervals: { ...state.settings.notificationIntervals, ...intervals } }
  })),
  updateUserInfo: (userInfo) => set((state) => ({
    settings: { ...state.settings, userInfo: { ...state.settings.userInfo, ...userInfo } }
  })),

  // Meals tracking
  mealsData: {},
  addMeal: (meal) => {
    const today = getToday()
    set((state) => ({
      mealsData: {
        ...state.mealsData,
        [today]: [...(state.mealsData[today] || []), { ...meal, id: generateId(), timestamp: Date.now() }]
      }
    }))
  },
  removeMeal: (mealId) => {
    const today = getToday()
    set((state) => ({
      mealsData: {
        ...state.mealsData,
        [today]: (state.mealsData[today] || []).filter(meal => meal.id !== mealId)
      }
    }))
  },
  updateMeal: (mealId, updates) => {
    const today = getToday()
    set((state) => ({
      mealsData: {
        ...state.mealsData,
        [today]: (state.mealsData[today] || []).map(meal => 
          meal.id === mealId ? { ...meal, ...updates } : meal
        )
      }
    }))
  },

  // Sleep tracking
  sleepData: {},
  setSleepEntry: (entry) => {
    const today = getToday()
    set((state) => ({
      sleepData: {
        ...state.sleepData,
        [today]: { ...entry, date: today }
      }
    }))
  },
  removeSleepEntry: () => {
    const today = getToday()
    const { [today]: _, ...rest } = get().sleepData
    set({ sleepData: rest })
  },

  // Body measurements tracking
  bodyMeasurementsData: {},
  addBodyMeasurement: (measurement) => {
    const today = getToday()
    set((state) => ({
      bodyMeasurementsData: {
        ...state.bodyMeasurementsData,
        [today]: { ...measurement, date: today }
      }
    }))
  },

  // Water tracking
  waterData: {},
  addWater: (amount) => {
    const today = getToday()
    set((state) => ({
      waterData: {
        ...state.waterData,
        [today]: {
          amount: (state.waterData[today]?.amount || 0) + amount,
          goal: state.settings.waterGoal,
          date: today,
        }
      }
    }))
  },
  resetWater: () => {
    const today = getToday()
    set((state) => ({
      waterData: {
        ...state.waterData,
        [today]: { amount: 0, goal: state.settings.waterGoal, date: today }
      }
    }))
  },

  // Gym tracking
  gymData: {},
  addGymEntry: (entry) => {
    const today = getToday()
    set((state) => ({
      gymData: {
        ...state.gymData,
        [today]: { ...entry, date: today, completed: true }
      }
    }))
  },
  removeGymEntry: () => {
    const today = getToday()
    const { [today]: _, ...rest } = get().gymData
    set({ gymData: rest })
  },

  // Sugar tracking
  sugarData: {},
  setSugarEntry: (hadSugar) => {
    const today = getToday()
    set((state) => ({
      sugarData: {
        ...state.sugarData,
        [today]: { date: today, hadSugar }
      }
    }))
  },
  removeSugarEntry: () => {
    const today = getToday()
    const { [today]: _, ...rest } = get().sugarData
    set({ sugarData: rest })
  },

  // Routines
  routineData: {},
  initializeRoutine: () => {
    const today = getToday()
    set((state) => ({
      routineData: {
        ...state.routineData,
        [today]: {
          morning: state.routineData[today]?.morning || defaultMorningRoutine.map(r => ({ ...r, completed: false })),
          night: state.routineData[today]?.night || defaultNightRoutine.map(r => ({ ...r, completed: false })),
        }
      }
    }))
  },
  toggleRoutineItem: (timeOfDay, itemId) => {
    const today = getToday()
    set((state) => {
      const todayData = state.routineData[today] || { morning: defaultMorningRoutine, night: defaultNightRoutine }
      const routine = timeOfDay === 'morning' ? todayData.morning : todayData.night
      const updatedRoutine = routine.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
      return {
        routineData: {
          ...state.routineData,
          [today]: {
            ...todayData,
            [timeOfDay]: updatedRoutine
          }
        }
      }
    })
  },
  addRoutineItem: (timeOfDay, text) => {
    const today = getToday()
    set((state) => {
      const todayData = state.routineData[today] || { morning: defaultMorningRoutine, night: defaultNightRoutine }
      const newItem = { id: generateId(), text, completed: false }
      return {
        routineData: {
          ...state.routineData,
          [today]: {
            ...todayData,
            [timeOfDay]: [...todayData[timeOfDay], newItem]
          }
        }
      }
    })
  },
  removeRoutineItem: (timeOfDay, itemId) => {
    const today = getToday()
    set((state) => {
      const todayData = state.routineData[today] || { morning: defaultMorningRoutine, night: defaultNightRoutine }
      return {
        routineData: {
          ...state.routineData,
          [today]: {
            ...todayData,
            [timeOfDay]: todayData[timeOfDay].filter(item => item.id !== itemId)
          }
        }
      }
    })
  },

  // Get full state for Firebase
  getFullState: () => {
    const state = get()
    return {
      settings: state.settings,
      waterData: state.waterData,
      gymData: state.gymData,
      sugarData: state.sugarData,
      routineData: state.routineData,
      mealsData: state.mealsData,
      sleepData: state.sleepData,
      bodyMeasurementsData: state.bodyMeasurementsData,
    }
  },

  // Load from Firebase
  loadFromFirebase: (data) => {
    if (data) {
      set({
        settings: data.settings || get().settings,
        waterData: data.waterData || {},
        gymData: data.gymData || {},
        sugarData: data.sugarData || {},
        routineData: data.routineData || {},
        mealsData: data.mealsData || {},
        sleepData: data.sleepData || {},
        bodyMeasurementsData: data.bodyMeasurementsData || {},
        isSynced: true,
        isLoading: false,
        lastSynced: new Date().toISOString(),
      })
    } else {
      set({ isLoading: false })
    }
  },

  // Computed getters
  getTodayStats: () => {
    const state = get()
    const today = getToday()
    
    const water = state.waterData[today]
    const gym = state.gymData[today]
    const sugar = state.sugarData[today]
    const routine = state.routineData[today]
    const meals = state.mealsData[today]
    const sleep = state.sleepData[today]
    const body = state.bodyMeasurementsData[today]
    
    const waterCompleted = water && water.amount >= water.goal
    const gymCompleted = gym?.completed || false
    const sugarCompleted = sugar && !sugar.hadSugar
    
    const morningRoutine = routine?.morning || defaultMorningRoutine
    const nightRoutine = routine?.night || defaultNightRoutine
    const morningCompleted = morningRoutine.every(r => r.completed)
    const nightCompleted = nightRoutine.every(r => r.completed)
    
    const mealsCompleted = meals && meals.length >= 3 // Considera 3 comidas como completado
    const sleepCompleted = sleep && sleep.duration?.totalMinutes >= 480 // 8 horas
    const bodyCompleted = body && body.weight && body.height
    
    const habits = [
      { id: 'water', name: 'Agua', completed: waterCompleted, required: true },
      { id: 'gym', name: 'Gym', completed: gymCompleted, required: true },
      { id: 'sugar', name: 'Sin azúcar', completed: sugarCompleted, required: true },
      { id: 'meals', name: 'Comidas', completed: mealsCompleted, required: true },
      { id: 'sleep', name: 'Sueño', completed: sleepCompleted, required: false },
      { id: 'body', name: 'Medidas', completed: bodyCompleted, required: false },
      { id: 'morning', name: 'Rutina mañana', completed: morningCompleted, required: false },
      { id: 'night', name: 'Rutina noche', completed: nightCompleted, required: false },
    ]
    
    const completed = habits.filter(h => h.completed).length
    const total = habits.length
    const percentage = Math.round((completed / total) * 100)
    
    return {
      habits,
      completed,
      total,
      percentage,
      water,
      gym,
      sugar,
      meals,
      sleep,
      body,
      morningRoutine,
      nightRoutine,
    }
  },

  // Streak calculations
  calculateStreak: () => {
    const state = get()
    let streak = 0
    let currentDate = new Date()
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const water = state.waterData[dateStr]
      const gym = state.gymData[dateStr]
      const sugar = state.sugarData[dateStr]
      
      const waterOk = water && water.amount >= water.goal
      const gymOk = gym?.completed || false
      const sugarOk = sugar && !sugar.hadSugar
      
      if (waterOk && gymOk && sugarOk) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else if (dateStr === getToday()) {
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  },

  // Weekly data
  getWeeklyData: () => {
    const state = get()
    const data = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const water = state.waterData[dateStr]
      const gym = state.gymData[dateStr]
      const sugar = state.sugarData[dateStr]
      
      const waterOk = water && water.amount >= water.goal
      const gymOk = gym?.completed || false
      const sugarOk = sugar && !sugar.hadSugar
      
      const completed = [waterOk, gymOk, sugarOk].filter(Boolean).length
      const percentage = Math.round((completed / 3) * 100)
      
      data.push({
        date: dateStr,
        day: date.toLocaleDateString('es', { weekday: 'short' }),
        completed,
        percentage,
      })
    }
    
    return data
  },

  // Sugar streak
  getSugarStreak: () => {
    const state = get()
    let streak = 0
    let currentDate = new Date()
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const sugar = state.sugarData[dateStr]
      
      if (sugar && !sugar.hadSugar) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else if (dateStr === getToday()) {
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  },

  // Analytics
  getMonthlyData: () => {
    const state = get()
    const data = []
    const currentDate = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(currentDate)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const water = state.waterData[dateStr]
      const gym = state.gymData[dateStr]
      const sugar = state.sugarData[dateStr]
      
      const completed = [
        water && water.amount >= water.goal,
        gym?.completed || false,
        sugar && !sugar.hadSugar,
      ].filter(Boolean).length
      
      data.push({
        date: dateStr,
        day: date.getDate(),
        completed,
      })
    }
    
    return data
  },
}))

// Motivational quotes
export const quotes = [
  "La disciplina es el puente entre tus metas y tus logros.",
  "Cada dia es una oportunidad para ser mejor.",
  "El exito es la suma de pequenos esfuerzos repetidos.",
  "No esperes motivacion, se la disciplina.",
  "Tu unico limite eres tu mismo.",
  "Los habitos construyen el caracter.",
  "El progreso no la perfeccion.",
  "La excelencia es un habito.",
  "Pequenos pasos, grandes cambios.",
  "Hoy es otro dia para ganar.",
  "La consistencia vence al talento.",
  "El cambio comienza contigo.",
]

export const getDailyQuote = () => {
  const today = getToday()
  const dayNum = new Date(today).getDate()
  return quotes[dayNum % quotes.length]
}
