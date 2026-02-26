import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Skull, Check, X, AlertTriangle, Flame, Calendar, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Sugar() {
  const { sugarData, setSugarEntry, removeSugarEntry, getSugarStreak, getWeeklyData, getMonthlyData } = useStore()
  
  const today = new Date().toISOString().split('T')[0]
  const todaySugar = sugarData[today]
  
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  
  const sugarStreak = getSugarStreak()
  
  const weeklyData = getWeeklyData().map(d => ({
    ...d,
    noSugar: sugarData[d.date]?.hadSugar === false ? 1 : sugarData[d.date]?.hadSugar === true ? 0 : null,
  }))
  
  const monthlyData = getMonthlyData()
  
  // Calculate monthly stats
  const monthNoSugar = monthlyData.filter(d => d.date <= today && sugarData[d.date]?.hadSugar === false).length
  const monthTotal = monthlyData.filter(d => d.date <= today).length

  const handleAnswer = (hadSugar) => {
    setSelectedAnswer(hadSugar)
    setShowConfirm(true)
  }
  
  const handleModify = () => {
    removeSugarEntry()
  }
  
  const confirmAnswer = () => {
    setSugarEntry(selectedAnswer)
    setShowConfirm(false)
  }

  return (
    <div className="fade-in space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent-orange/10 rounded-xl">
            <Skull className="text-accent-orange" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary">Azúcar</h1>
            <p className="text-text-secondary text-sm">Controla tu consumo</p>
          </div>
        </div>
      </div>

      {/* Today's Question */}
      <div className="bg-bg-secondary rounded-xl p-6 border border-border-color">
        <h2 className="text-xl font-heading font-bold text-text-primary text-center mb-6">
          ¿Consumiste azúcar hoy?
        </h2>
        
        {!todaySugar ? (
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 max-w-48 bg-accent-green/10 border-2 border-accent-green rounded-xl py-4 hover:bg-accent-green/20 transition-all group"
            >
              <X className="mx-auto text-accent-green mb-2 group-hover:scale-110 transition-transform" size={32} />
              <p className="text-accent-green font-bold">NO</p>
              <p className="text-text-tertiary text-xs">Sin azúcar</p>
            </button>
            
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 max-w-48 bg-accent-red/10 border-2 border-accent-red rounded-xl py-4 hover:bg-accent-red/20 transition-all group"
            >
              <Check className="mx-auto text-accent-red mb-2 group-hover:scale-110 transition-transform" size={32} />
              <p className="text-accent-red font-bold">SÍ</p>
              <p className="text-text-tertiary text-xs">Contaminado</p>
            </button>
          </div>
        ) : todaySugar.hadSugar ? (
          <div className="text-center">
            <div className="inline-flex p-4 bg-accent-red/10 rounded-full mb-4">
              <AlertTriangle className="text-accent-red" size={48} />
            </div>
            <h3 className="text-xl font-heading font-bold text-accent-red mb-2">
              Hoy consumiste azúcar
            </h3>
            <p className="text-text-secondary mb-4">
              Mañana es otro día para intentarlo
            </p>
            <button
              onClick={handleModify}
              className="text-text-tertiary text-sm hover:underline"
            >
              Modificar respuesta
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex p-4 bg-accent-green/10 rounded-full mb-4">
              <Check className="text-accent-green" size={48} />
            </div>
            <h3 className="text-xl font-heading font-bold text-accent-green mb-2">
              ¡Excelente! Sin azúcar hoy
            </h3>
            <p className="text-text-secondary mb-4">
              Manteniendo la disciplina
            </p>
            <button
              onClick={handleModify}
              className="text-text-tertiary text-sm hover:underline"
            >
              Modificar respuesta
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-secondary rounded-2xl p-6 max-w-sm w-full modal-animate">
            <div className="text-center mb-6">
              <AlertTriangle 
                className={`mx-auto mb-4 ${selectedAnswer ? 'text-accent-red' : 'text-accent-green'}`} 
                size={48} 
              />
              <h3 className="text-xl font-heading font-bold text-text-primary">
                ¿Estás seguro?
              </h3>
            </div>
            
            <p className="text-text-secondary text-center mb-6">
              {selectedAnswer 
                ? 'Esto romperá tu racha de días sin azúcar. ¿Confirmas?'
                : '¡Bien! Mantén esa racha de días sin azúcar.'
              }
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-bg-tertiary border border-border-color text-text-secondary py-3 rounded-xl hover:bg-bg-primary transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAnswer}
                className={`flex-1 font-bold py-3 rounded-xl transition-all ${
                  selectedAnswer 
                    ? 'bg-accent-red text-white hover:bg-accent-red/80' 
                    : 'bg-accent-green text-bg-primary hover:bg-accent-green/80'
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="text-accent-green" size={18} />
            <span className="text-text-secondary text-sm">Racha actual</span>
          </div>
          <p className="text-3xl font-mono font-bold text-accent-green">
            {sugarStreak} <span className="text-text-tertiary text-base">días</span>
          </p>
        </div>
        
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-accent-orange" size={18} />
            <span className="text-text-secondary text-sm">Este mes</span>
          </div>
          <p className="text-3xl font-mono font-bold text-text-primary">
            {monthNoSugar}/{monthTotal} <span className="text-text-tertiary text-base">días</span>
          </p>
        </div>
      </div>

      {/* Monthly Calendar */}
      <div className="bg-bg-secondary rounded-xl p-6 border border-border-color">
        <h2 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Calendar className="text-accent-orange" size={20} />
          Este Mes
        </h2>
        
        <div className="grid grid-cols-7 gap-1">
          {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day, i) => (
            <div key={i} className="text-center text-text-tertiary text-xs py-2">
              {day}
            </div>
          ))}
          
          {monthlyData.map((day, i) => {
            const sugarEntry = sugarData[day.date]
            let bgClass = 'bg-bg-tertiary'
            let textClass = 'text-text-tertiary'
            
            if (sugarEntry) {
              if (sugarEntry.hadSugar === false) {
                bgClass = 'bg-accent-green/20'
                textClass = 'text-accent-green'
              } else if (sugarEntry.hadSugar === true) {
                bgClass = 'bg-accent-red/20'
                textClass = 'text-accent-red'
              }
            }
            
            return (
              <div
                key={i}
                className={`aspect-square rounded-lg ${bgClass} flex items-center justify-center text-xs ${textClass}`}
              >
                {day.day}
              </div>
            )
          })}
        </div>
        
        <div className="flex gap-4 mt-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-accent-green/20" />
            <span className="text-text-tertiary text-xs">Sin azúcar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-accent-red/20" />
            <span className="text-text-tertiary text-xs">Con azúcar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-bg-tertiary" />
            <span className="text-text-tertiary text-xs">Sin registro</span>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-bg-secondary rounded-xl p-6 border border-border-color">
        <h2 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
          <TrendingUp className="text-accent-green" size={20} />
          Esta Semana
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
                formatter={(value) => {
                  if (value === 1) return ['✓ Sin azúcar', '']
                  if (value === 0) return ['✗ Con azúcar', '']
                  return ['Sin registro', '']
                }}
              />
              <Bar 
                dataKey="noSugar" 
                fill="#00ff88" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
