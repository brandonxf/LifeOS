import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Moon, Clock, Check, X, Plus } from 'lucide-react'

export default function Sleep() {
  const { sleepData, setSleepEntry, removeSleepEntry } = useStore()
  
  const today = new Date().toISOString().split('T')[0]
  const todaySleep = sleepData[today]

  const [showForm, setShowForm] = useState(false)
  const [sleepTime, setSleepTime] = useState('22:00')
  const [wakeTime, setWakeTime] = useState('07:00')
  const [quality, setQuality] = useState(3)
  const [notes, setNotes] = useState('')

  const calculateSleepDuration = (sleep, wake) => {
    const [sleepH, sleepM] = sleep.split(':').map(Number)
    const [wakeH, wakeM] = wake.split(':').map(Number)
    
    let totalMinutes = (wakeH - sleepH) * 60 + (wakeM - sleepM)
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60
    }
    
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    
    return { hours, minutes, totalMinutes }
  }

  const handleSubmit = () => {
    const duration = calculateSleepDuration(sleepTime, wakeTime)
    setSleepEntry({
      sleepTime,
      wakeTime,
      duration,
      quality,
      notes,
    })
    setShowForm(false)
    resetForm()
  }

  const resetForm = () => {
    setSleepTime('22:00')
    setWakeTime('07:00')
    setQuality(3)
    setNotes('')
  }

  return (
    <div className="fade-in space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent-purple/10 rounded-xl">
            <Moon className="text-accent-purple" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary">Sueño</h1>
            <p className="text-text-secondary text-sm">Rastrea tu descanso</p>
          </div>
        </div>
      </div>

      {/* Today's Status */}
      <div className="bg-bg-secondary rounded-xl p-6 border border-border-color">
        {todaySleep ? (
          <div className="text-center">
            <div className="inline-flex p-4 bg-accent-green/10 rounded-full mb-4">
              <Check className="text-accent-green" size={48} />
            </div>
            <h2 className="text-xl font-heading font-bold text-accent-green mb-2">
              ¡Descanso completado!
            </h2>
            <p className="text-text-secondary">
              Dormiste {todaySleep.duration.hours}h {todaySleep.duration.minutes}m • 
              {Array(todaySleep.quality).fill('★').join('')}
            </p>
            <p className="text-text-tertiary text-sm mt-1">
              {todaySleep.sleepTime} - {todaySleep.wakeTime}
            </p>
            {todaySleep.notes && (
              <p className="text-text-tertiary mt-2 italic">"{todaySleep.notes}"</p>
            )}
            
            <button
              onClick={() => {
                removeSleepEntry()
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
              ¿Dormiste bien?
            </h2>
            <p className="text-text-secondary mb-4">
              Registra tu horario de sueño
            </p>
            
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="bg-accent-purple text-white font-bold px-8 py-3 rounded-xl hover:bg-accent-purple/80 transition-all"
              >
                Registrar Sueño
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Sleep Form */}
      {showForm && !todaySleep && (
        <div className="bg-bg-secondary rounded-xl p-6 border border-accent-purple/30 animate-fade-in">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
            Registrar sueño
          </h3>

          {/* Sleep Time */}
          <div className="mb-4">
            <label className="text-text-secondary text-sm block mb-2">Hora de dormir</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={18} />
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="w-full bg-bg-tertiary border border-border-color rounded-lg px-10 py-3 text-text-primary focus:outline-none focus:border-accent-purple"
              />
            </div>
          </div>

          {/* Wake Time */}
          <div className="mb-4">
            <label className="text-text-secondary text-sm block mb-2">Hora de despertar</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={18} />
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full bg-bg-tertiary border border-border-color rounded-lg px-10 py-3 text-text-primary focus:outline-none focus:border-accent-purple"
              />
            </div>
          </div>

          {/* Quality */}
          <div className="mb-4">
            <label className="text-text-secondary text-sm block mb-2">Calidad del sueño</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setQuality(star)}
                  className="flex-1 py-2 rounded-lg border transition-all"
                  style={{
                    backgroundColor: quality >= star ? '#a855f7' : '#1a1a24',
                    borderColor: quality >= star ? '#a855f7' : '#2a2a3a',
                  }}
                >
                  <Moon 
                    size={20} 
                    className="mx-auto"
                    fill={quality >= star ? '#fff' : 'none'}
                    color={quality >= star ? '#fff' : '#4a4a5a'}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="text-text-secondary text-sm block mb-2">Notas (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: No pude dormir bien, me desperté temprano..."
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
              disabled={!sleepTime || !wakeTime}
              className="flex-1 bg-accent-purple text-white font-bold py-3 rounded-xl hover:bg-accent-purple/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}