import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Droplets, Plus, Minus, Settings, Flame, TrendingUp, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Water() {
  const { 
    waterData, 
    addWater, 
    settings, 
    updateSettings,
    getWeeklyData 
  } = useStore()
  
  const [customAmount, setCustomAmount] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  
  const today = new Date().toISOString().split('T')[0]
  const todayWater = waterData[today] || { amount: 0, goal: settings.waterGoal }
  const percentage = Math.min(100, Math.round((todayWater.amount / todayWater.goal) * 100))
  const remaining = Math.max(0, todayWater.goal - todayWater.amount)
  
  const quickAdd = [250, 500, 750, 1000]
  
  const weeklyData = getWeeklyData().map(d => ({
    ...d,
    amount: waterData[d.date]?.amount || 0,
  }))

  return (
    <div className="fade-in space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent-blue/10 rounded-xl">
            <Droplets className="text-accent-blue" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary">Agua</h1>
            <p className="text-text-secondary text-sm">Mantente hidratado</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 bg-bg-secondary rounded-lg border border-border-color hover:border-accent-blue transition-all"
        >
          <Settings className="text-text-secondary" size={20} />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-bg-secondary rounded-xl p-4 border border-accent-blue/30 animate-fade-in">
          <h3 className="text-text-primary font-medium mb-3">Meta diaria</h3>
          <div className="flex gap-2">
            <input
              type="number"
              value={settings.waterGoal}
              onChange={(e) => updateSettings({ waterGoal: parseInt(e.target.value) || 2500 })}
              className="flex-1 bg-bg-tertiary border border-border-color rounded-lg px-4 py-2 text-text-primary font-mono focus:outline-none focus:border-accent-blue"
            />
            <span className="text-text-secondary py-2">ml</span>
          </div>
        </div>
      )}

      {/* Main Progress */}
      <div className="bg-bg-secondary rounded-xl p-6 border border-border-color relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/5 to-transparent" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-text-secondary text-sm">Hoy has bebido</p>
              <p className="text-4xl font-mono font-bold text-accent-blue mt-1">
                {todayWater.amount}ml
              </p>
            </div>
            <div className="text-right">
              <p className="text-text-secondary text-sm">Meta</p>
              <p className="text-xl font-mono text-text-primary">{todayWater.goal}ml</p>
            </div>
          </div>
          
          {/* Water Tank Visualization */}
          <div className="relative h-40 bg-bg-tertiary rounded-xl overflow-hidden mb-4">
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-accent-blue/80 to-accent-blue/40 transition-all duration-500"
              style={{ height: `${percentage}%` }}
            >
              {/* Wave effect */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full wave-animation" />
              </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-mono font-bold text-white drop-shadow-lg">
                {percentage}%
              </span>
            </div>
          </div>
          
          {remaining > 0 ? (
            <p className="text-center text-text-secondary">
              Te faltan <span className="text-accent-blue font-mono">{remaining}ml</span>
            </p>
          ) : (
            <p className="text-center text-accent-green font-medium flex items-center justify-center gap-2">
              <Flame size={18} />
              ¡Meta alcanzada!
            </p>
          )}
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div>
        <h2 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Plus className="text-accent-blue" size={20} />
          Añadir agua
        </h2>
        
        <div className="grid grid-cols-4 gap-2 mb-4">
          {quickAdd.map((amount) => (
            <button
              key={amount}
              onClick={() => addWater(amount)}
              className="bg-bg-secondary border border-border-color rounded-xl py-3 px-2 hover:border-accent-blue hover:bg-accent-blue/10 transition-all group"
            >
              <p className="text-accent-blue font-mono font-bold text-lg group-hover:scale-110 transition-transform">
                +{amount}
              </p>
              <p className="text-text-tertiary text-xs">ml</p>
            </button>
          ))}
        </div>
        
        {/* Custom Amount */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Cantidad personalizada"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="flex-1 bg-bg-secondary border border-border-color rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-blue"
          />
          <button
            onClick={() => {
              if (customAmount) {
                addWater(parseInt(customAmount))
                setCustomAmount('')
              }
            }}
            disabled={!customAmount}
            className="bg-accent-blue text-bg-primary font-bold px-6 rounded-xl hover:bg-accent-blue/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Añadir
          </button>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-bg-secondary rounded-xl p-6 border border-border-color">
        <h2 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
          <TrendingUp className="text-accent-blue" size={20} />
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
                domain={[0, settings.waterGoal]} 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#12121a',
                  border: '1px solid #2a2a3a',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value) => [`${value}ml`, 'Consumido']}
              />
              <Bar 
                dataKey="amount" 
                fill="#00d4ff" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
