import React, { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { SunMoon, Check, Plus, X, Sunrise, Sunset, Flame, Trash2 } from 'lucide-react'

export default function Routines() {
  const { 
    routineData, 
    toggleRoutineItem, 
    addRoutineItem, 
    removeRoutineItem,
    initializeRoutine 
  } = useStore()
  
  const [timeOfDay, setTimeOfDay] = useState('morning')
  const [newItem, setNewItem] = useState('')
  
  useEffect(() => {
    initializeRoutine()
  }, [])
  
  const today = new Date().toISOString().split('T')[0]
  const todayRoutine = routineData[today] || { 
    morning: [], 
    night: [] 
  }
  
  const currentRoutine = timeOfDay === 'morning' ? todayRoutine.morning : todayRoutine.night
  
  const completedCount = currentRoutine.filter(item => item.completed).length
  const totalCount = currentRoutine.length
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const handleAddItem = () => {
    if (newItem.trim()) {
      addRoutineItem(timeOfDay, newItem.trim())
      setNewItem('')
    }
  }

  const defaultMorningItems = [
    'Despertar temprano',
    'Ejercicio / Estiramiento',
    'Ducha fría',
    'Desayuno saludable',
    'Revisar objetivos del día',
  ]
  
  const defaultNightItems = [
    'Revisar el día',
    'Preparar mañana',
    'Leer 30 minutos',
    'Meditar',
    'Dormir temprano',
  ]

  return (
    <div className="fade-in space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent-yellow/10 rounded-xl">
            <SunMoon className="text-accent-yellow" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary">Rutinas</h1>
            <p className="text-text-secondary text-sm">Construye hábitos diarios</p>
          </div>
        </div>
      </div>

      {/* Time of Day Toggle */}
      <div className="bg-bg-secondary rounded-xl p-1 border border-border-color flex">
        <button
          onClick={() => setTimeOfDay('morning')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
            timeOfDay === 'morning' 
              ? 'bg-accent-yellow/20 text-accent-yellow' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Sunrise size={20} />
          <span className="font-medium">Mañana</span>
        </button>
        <button
          onClick={() => setTimeOfDay('night')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
            timeOfDay === 'night' 
              ? 'bg-accent-purple/20 text-accent-purple' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Sunset size={20} />
          <span className="font-medium">Noche</span>
        </button>
      </div>

      {/* Progress */}
      <div className="bg-bg-secondary rounded-xl p-6 border border-border-color">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {timeOfDay === 'morning' ? (
              <Sunrise className="text-accent-yellow" size={24} />
            ) : (
              <Sunset className="text-accent-purple" size={24} />
            )}
            <div>
              <h2 className="text-lg font-heading font-semibold text-text-primary">
                Rutina de {timeOfDay === 'morning' ? 'mañana' : 'noche'}
              </h2>
              <p className="text-text-secondary text-sm">
                {completedCount} de {totalCount} completados
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className={`text-2xl font-mono font-bold ${percentage === 100 ? 'text-accent-green' : 'text-text-primary'}`}>
              {percentage}%
            </p>
            {percentage === 100 && (
              <p className="text-accent-green text-sm flex items-center gap-1">
                <Flame size={14} /> ¡Completada!
              </p>
            )}
          </div>
        </div>
        
        <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              timeOfDay === 'morning' ? 'bg-gradient-to-r from-accent-yellow to-accent-orange' : 'bg-gradient-to-r from-accent-purple to-accent-blue'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-bg-secondary rounded-xl border border-border-color overflow-hidden">
        {currentRoutine.length > 0 ? (
          <div className="divide-y divide-border-color">
            {currentRoutine.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3 p-4 hover:bg-bg-tertiary/50 transition-colors"
              >
                <button
                  onClick={() => toggleRoutineItem(timeOfDay, item.id)}
                  className={`
                    w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                    ${item.completed 
                      ? 'bg-accent-green border-accent-green' 
                      : 'border-border-color hover:border-accent-green'
                    }
                  `}
                >
                  {item.completed && <Check size={16} className="text-bg-primary" />}
                </button>
                
                <span className={`flex-1 ${item.completed ? 'text-text-tertiary line-through' : 'text-text-primary'}`}>
                  {item.text}
                </span>
                
                <button
                  onClick={() => removeRoutineItem(timeOfDay, item.id)}
                  className="p-1 text-text-tertiary hover:text-accent-red transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-text-tertiary">
            <p>No hay elementos en esta rutina</p>
          </div>
        )}
      </div>

      {/* Add New Item */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          placeholder="Añadir nuevo elemento..."
          className="flex-1 bg-bg-secondary border border-border-color rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-green"
        />
        <button
          onClick={handleAddItem}
          disabled={!newItem.trim()}
          className="bg-accent-green text-bg-primary font-bold px-4 rounded-xl hover:bg-accent-green/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Quick Add Defaults */}
      <div>
        <h3 className="text-text-secondary text-sm mb-3">Añadir rápidamente:</h3>
        <div className="flex flex-wrap gap-2">
          {(timeOfDay === 'morning' ? defaultMorningItems : defaultNightItems).map((item) => (
            <button
              key={item}
              onClick={() => addRoutineItem(timeOfDay, item)}
              className="bg-bg-tertiary border border-border-color rounded-lg px-3 py-2 text-sm text-text-secondary hover:border-accent-green hover:text-accent-green transition-all"
            >
              + {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
