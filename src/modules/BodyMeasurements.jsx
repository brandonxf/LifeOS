import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Scale, Ruler, Activity, Target } from 'lucide-react'

export default function BodyMeasurements() {
  const { bodyMeasurementsData, addBodyMeasurement } = useStore()
  
  const today = new Date().toISOString().split('T')[0]
  const todayMeasurements = bodyMeasurementsData[today]

  const [showForm, setShowForm] = useState(false)
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [bodyFat, setBodyFat] = useState('')
  const [muscleMass, setMuscleMass] = useState('')
  const [waist, setWaist] = useState('')
  const [hips, setHips] = useState('')

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null
    const heightM = height / 100
    return Math.round((weight / (heightM * heightM)) * 10) / 10
  }

  const getBMICategory = (bmi) => {
    if (!bmi) return null
    if (bmi < 18.5) return { category: 'Bajo peso', color: 'accent-yellow' }
    if (bmi < 25) return { category: 'Peso normal', color: 'accent-green' }
    if (bmi < 30) return { category: 'Sobrepeso', color: 'accent-orange' }
    return { category: 'Obesidad', color: 'accent-red' }
  }

  const handleSubmit = () => {
    addBodyMeasurement({
      weight: parseFloat(weight),
      height: parseFloat(height),
      bodyFat: parseFloat(bodyFat),
      muscleMass: parseFloat(muscleMass),
      waist: parseFloat(waist),
      hips: parseFloat(hips),
    })
    setShowForm(false)
    resetForm()
  }

  const resetForm = () => {
    setWeight('')
    setHeight('')
    setBodyFat('')
    setMuscleMass('')
    setWaist('')
    setHips('')
  }

  const bmi = todayMeasurements ? calculateBMI(todayMeasurements.weight, todayMeasurements.height) : null
  const bmiCategory = bmi ? getBMICategory(bmi) : null

  return (
    <div className="fade-in space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent-green/10 rounded-xl">
            <Scale className="text-accent-green" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary">Medidas Corporales</h1>
            <p className="text-text-secondary text-sm">Rastrea tu progreso</p>
          </div>
        </div>
      </div>

      {/* Current Measurements */}
      {todayMeasurements && (
        <div className="bg-bg-secondary rounded-xl p-6 border border-border-color">
          <h2 className="text-lg font-heading font-semibold text-text-primary mb-4">Medidas de hoy</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg-tertiary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="text-accent-green" size={18} />
                <span className="text-text-secondary text-sm">Peso</span>
              </div>
              <p className="text-2xl font-mono font-bold text-text-primary">{todayMeasurements.weight} kg</p>
            </div>
            <div className="bg-bg-tertiary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Ruler className="text-accent-blue" size={18} />
                <span className="text-text-secondary text-sm">Altura</span>
              </div>
              <p className="text-2xl font-mono font-bold text-text-primary">{todayMeasurements.height} cm</p>
            </div>
            <div className="bg-bg-tertiary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="text-accent-purple" size={18} />
                <span className="text-text-secondary text-sm">Grasa corporal</span>
              </div>
              <p className="text-2xl font-mono font-bold text-text-primary">{todayMeasurements.bodyFat}%</p>
            </div>
            <div className="bg-bg-tertiary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="text-accent-orange" size={18} />
                <span className="text-text-secondary text-sm">Masa muscular</span>
              </div>
              <p className="text-2xl font-mono font-bold text-text-primary">{todayMeasurements.muscleMass} kg</p>
            </div>
            <div className="bg-bg-tertiary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Ruler className="text-accent-yellow" size={18} />
                <span className="text-text-secondary text-sm">Cintura</span>
              </div>
              <p className="text-2xl font-mono font-bold text-text-primary">{todayMeasurements.waist} cm</p>
            </div>
            <div className="bg-bg-tertiary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Ruler className="text-accent-red" size={18} />
                <span className="text-text-secondary text-sm">Caderas</span>
              </div>
              <p className="text-2xl font-mono font-bold text-text-primary">{todayMeasurements.hips} cm</p>
            </div>
          </div>
          
          {bmi && bmiCategory && (
            <div className={`mt-4 p-4 rounded-lg bg-${bmiCategory.color}/10 border border-${bmiCategory.color}`}>
              <div className="flex items-center gap-2 mb-1">
                <Activity className={`text-${bmiCategory.color}`} size={18} />
                <span className="text-text-secondary text-sm">IMC</span>
              </div>
              <p className="text-2xl font-mono font-bold text-text-primary">
                {bmi} <span className="text-text-secondary text-sm">{bmiCategory.category}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm ? (
        <div className="bg-bg-secondary rounded-xl p-6 border border-accent-green/30 animate-fade-in">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
            {todayMeasurements ? 'Editar medidas' : 'Agregar medidas'}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-text-secondary text-sm block mb-2">Peso (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                step="0.1"
                className="w-full bg-bg-tertiary border border-border-color rounded-lg px-4 py-3 text-text-primary font-mono focus:outline-none focus:border-accent-green"
              />
            </div>
            <div>
              <label className="text-text-secondary text-sm block mb-2">Altura (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="170"
                step="0.1"
                className="w-full bg-bg-tertiary border border-border-color rounded-lg px-4 py-3 text-text-primary font-mono focus:outline-none focus:border-accent-green"
              />
            </div>
            <div>
              <label className="text-text-secondary text-sm block mb-2">Grasa corporal (%)</label>
              <input
                type="number"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                placeholder="15"
                step="0.1"
                className="w-full bg-bg-tertiary border border-border-color rounded-lg px-4 py-3 text-text-primary font-mono focus:outline-none focus:border-accent-green"
              />
            </div>
            <div>
              <label className="text-text-secondary text-sm block mb-2">Masa muscular (kg)</label>
              <input
                type="number"
                value={muscleMass}
                onChange={(e) => setMuscleMass(e.target.value)}
                placeholder="50"
                step="0.1"
                className="w-full bg-bg-tertiary border border-border-color rounded-lg px-4 py-3 text-text-primary font-mono focus:outline-none focus:border-accent-green"
              />
            </div>
            <div>
              <label className="text-text-secondary text-sm block mb-2">Cintura (cm)</label>
              <input
                type="number"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                placeholder="80"
                step="0.1"
                className="w-full bg-bg-tertiary border border-border-color rounded-lg px-4 py-3 text-text-primary font-mono focus:outline-none focus:border-accent-green"
              />
            </div>
            <div>
              <label className="text-text-secondary text-sm block mb-2">Caderas (cm)</label>
              <input
                type="number"
                value={hips}
                onChange={(e) => setHips(e.target.value)}
                placeholder="95"
                step="0.1"
                className="w-full bg-bg-tertiary border border-border-color rounded-lg px-4 py-3 text-text-primary font-mono focus:outline-none focus:border-accent-green"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
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
              disabled={!weight || !height}
              className="flex-1 bg-accent-green text-white font-bold py-3 rounded-xl hover:bg-accent-green/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {todayMeasurements ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-bg-secondary border border-border-color text-text-primary font-bold py-4 rounded-xl hover:bg-bg-primary transition-all flex items-center justify-center gap-2"
        >
          <Scale size={20} />
          {todayMeasurements ? 'Actualizar Medidas' : 'Agregar Medidas'}
        </button>
      )}
    </div>
  )
}