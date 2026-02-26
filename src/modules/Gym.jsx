import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Dumbbell, Check, X, Clock, Flame, Star, Calendar, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// MET (Metabolic Equivalent of Task) values for different workout types
const workoutMETs = {
  pecho: 4.5,
  piernas: 5.0,
  biceps: 4.0,
  triceps: 4.0,
  espalda: 4.5,
  abdomen: 4.0,
  cardio: 6.0,
  full: 5.5,
}

const workoutTypes = [
  { id: 'pecho', label: 'Pecho', color: 'accent-blue' },
  { id: 'piernas', label: 'Piernas', color: 'accent-orange' },
  { id: 'biceps', label: 'Bíceps', color: 'accent-purple' },
  { id: 'triceps', label: 'Tríceps', color: 'accent-green' },
  { id: 'espalda', label: 'Espalda', color: 'accent-yellow' },
  { id: 'abdomen', label: 'Abdomen', color: 'accent-red' },
  { id: 'cardio', label: 'Cardio', color: 'accent-blue' },
  { id: 'full', label: 'Full Body', color: 'accent-purple' },
]

// Calculate calories burned using MET formula:
// Calories = MET * weight * (duration / 60)
const calculateCaloriesBurned = (workoutType, duration, weight = 70) => {
  const met = workoutMETs[workoutType] || 4.5
  return Math.round(met * weight * (duration / 60))
}

export default function Gym() {
  const { gymData, addGymEntry, removeGymEntry, getWeeklyData, settings } = useStore()
  
  const today = new Date().toISOString().split('T')[0]
  const todayGym = gymData[today]
  
  const [showForm, setShowForm] = useState(false)
  const [workoutType, setWorkoutType] = useState('')
  const [duration, setDuration] = useState('')
  const [intensity, setIntensity] = useState(3)
  const [notes, setNotes] = useState('')
  
  // Calculate calories burned
  const caloriesBurned = workoutType && duration 
    ? calculateCaloriesBurned(workoutType, parseInt(duration), settings.userInfo.weight || 70)
    : 0
  
  const handleSubmit = () => {
    if (workoutType && duration) {
      addGymEntry({
        workoutType,
        duration: parseInt(duration),
        intensity,
        notes,
        caloriesBurned,
      })
      setShowForm(false)
      resetForm()
    }
  }
  
  const resetForm = () => {
    setWorkoutType('')
    setDuration('')
    setIntensity(3)
    setNotes('')
  }
  
  // Calculate weekly stats
  const weeklyData = getWeeklyData().map(d => ({
    ...d,
    gym: gymData[d.date]?.completed ? 1 : 0,
  }))
  
  const weeklyWorkouts = weeklyData.filter(d => d.gym).length

  return (
    <div className="fade-in space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent-purple/10 rounded-xl">
            <Dumbbell className="text-accent-purple" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary">Gym</h1>
            <p className="text-text-secondary text-sm">Entrena duro</p>
          </div>
        </div>
      </div>

      {/* Today's Status */}
      <div className="bg-bg-secondary rounded-xl p-6 border border-border-color">
        {todayGym?.completed ? (
          <div className="text-center">
            <div className="inline-flex p-4 bg-accent-green/10 rounded-full mb-4">
              <Check className="text-accent-green" size={48} />
            </div>
            <h2 className="text-xl font-heading font-bold text-accent-green mb-2">
              ¡Entrenamiento completado!
            </h2>
            <p className="text-text-secondary">
              {workoutTypes.find(t => t.id === todayGym.workoutType)?.label} • {todayGym.duration}min • 
              {Array(todayGym.intensity).fill('★').join('')}
            </p>
            {todayGym.caloriesBurned && (
              <p className="text-text-tertiary mt-1">
                🔥 {todayGym.caloriesBurned} kcal quemadas
              </p>
            )}
            {todayGym.notes && (
              <p className="text-text-tertiary mt-2 italic">"{todayGym.notes}"</p>
            )}
            
            <button
              onClick={() => {
                removeGymEntry()
                setShowForm(true)
              }}
              className="mt-4 text-accent-red text-sm hover:underline"
            >
              Cancelar / Modificar
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex p-4 bg-bg-tertiary rounded-full mb-4">
              <X className="text-text-tertiary" size={48} />
            </div>
            <h2 className="text-xl font-heading font-bold text-text-primary mb-2">
              ¿Entrenaste hoy?
            </h2>
            <p className="text-text-secondary mb-4">
              Registra tu entrenamiento
            </p>
            
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="bg-accent-purple text-white font-bold px-8 py-3 rounded-xl hover:bg-accent-purple/80 transition-all"
              >
                Registrar Entrenamiento
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Workout Form */}
      {showForm && !todayGym?.completed && (
        <div className="bg-bg-secondary rounded-xl p-6 border border-accent-purple/30 animate-fade-in">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
            Registrar entrenamiento
          </h3>
          
          {/* Workout Type */}
          <div className="mb-4">
            <label className="text-text-secondary text-sm block mb-2">Tipo de entrenamiento</label>
            <div className="grid grid-cols-4 gap-2">
              {workoutTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setWorkoutType(type.id)}
                  className={`
                    py-2 px-3 rounded-lg border text-sm font-medium transition-all
                    ${workoutType === type.id 
                      ? `bg-${type.color}/10 border-${type.color} text-${type.color}` 
                      : 'bg-bg-tertiary border-border-color text-text-secondary hover:border-text-tertiary'
                    }
                  `}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Duration */}
          <div className="mb-4">
            <label className="text-text-secondary text-sm block mb-2">Duración (minutos)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="60"
              className="w-full bg-bg-tertiary border border-border-color rounded-lg px-4 py-3 text-text-primary font-mono focus:outline-none focus:border-accent-purple"
            />
          </div>
          
          {/* Intensity */}
          <div className="mb-4">
            <label className="text-text-secondary text-sm block mb-2">Intensidad</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setIntensity(star)}
                  className="flex-1 py-2 rounded-lg border transition-all"
                  style={{
                    backgroundColor: intensity >= star ? '#a855f7' : '#1a1a24',
                    borderColor: intensity >= star ? '#a855f7' : '#2a2a3a',
                  }}
                >
                  <Star 
                    size={20} 
                    className="mx-auto"
                    fill={intensity >= star ? '#fff' : 'none'}
                    color={intensity >= star ? '#fff' : '#4a4a5a'}
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Calories Burned */}
          {caloriesBurned > 0 && (
            <div className="mb-4 bg-bg-tertiary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="text-accent-orange" size={18} />
                <span className="text-text-secondary text-sm">Calorías quemadas</span>
              </div>
              <p className="text-2xl font-mono font-bold text-text-primary">{caloriesBurned} kcal</p>
              <p className="text-text-tertiary text-xs">
                Basado en peso: {settings.userInfo.weight || 70} kg
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="mb-6">
            <label className="text-text-secondary text-sm block mb-2">Notas (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Sentí mucha energía, aumenté peso..."
              rows={3}
              className="w-full bg-bg-tertiary border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-purple resize-none"
            />
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowForm(false)
                resetForm()
              }}
              className="flex-1 bg-bg-tertiary border border-border-color text-text-secondary py-3 rounded-xl hover:bg-bg-primary transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!workoutType || !duration}
              className="flex-1 bg-accent-purple text-white font-bold py-3 rounded-xl hover:bg-accent-purple/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Weekly Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-accent-purple" size={18} />
            <span className="text-text-secondary text-sm">Esta semana</span>
          </div>
          <p className="text-2xl font-mono font-bold text-text-primary">
            {weeklyWorkouts}/7 <span className="text-text-tertiary text-sm">días</span>
          </p>
        </div>
        
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="text-accent-orange" size={18} />
            <span className="text-text-secondary text-sm">Racha actual</span>
          </div>
          <p className="text-2xl font-mono font-bold text-text-primary">
            {todayGym?.completed ? '1' : '0'} <span className="text-text-tertiary text-sm">días</span>
          </p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-bg-secondary rounded-xl p-6 border border-border-color">
        <h2 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
          <TrendingUp className="text-accent-purple" size={20} />
          Historial Semanal
        </h2>
        
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#8b8b9a', fontSize: 12 }}
              />
              <YAxis 
                hide 
                domain={[0, 1]} 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#12121a',
                  border: '1px solid #2a2a3a',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value) => [value ? '✓ Entrenado' : '—', '']}
              />
              <Bar 
                dataKey="gym" 
                fill="#a855f7" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
