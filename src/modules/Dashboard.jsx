import React, { useEffect, useState } from 'react'
import { useStore, getDailyQuote } from '../store/useStore'
import { Flame, TrendingUp, Target, Trophy, Droplets, Dumbbell, Skull, SunMoon, Calendar, Utensils, Moon, Scale } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const { 
    getTodayStats, 
    calculateStreak, 
    getWeeklyData, 
    setActiveModule,
    initializeRoutine 
  } = useStore()
  
  const [quote, setQuote] = useState('')
  
  useEffect(() => {
    initializeRoutine()
    setQuote(getDailyQuote())
  }, [])
  
  const stats = getTodayStats()
  const streak = calculateStreak()
  const weeklyData = getWeeklyData()
  
  const habitIcons = {
    water: Droplets,
    gym: Dumbbell,
    sugar: Skull,
    meals: Utensils,
    sleep: Moon,
    body: Scale,
    morning: SunMoon,
    night: SunMoon,
  }
  
  const habitColors = {
    water: 'accent-blue',
    gym: 'accent-purple',
    sugar: 'accent-orange',
    meals: 'accent-green',
    sleep: 'accent-purple',
    body: 'accent-yellow',
    morning: 'accent-yellow',
    night: 'accent-purple',
  }

  return (
    <div className="fade-in space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary">
            Hola, Brandon 👋
          </h1>
          <p className="text-text-secondary mt-1">
            {new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        
        {/* Streak Counter */}
        <div className="flex items-center gap-2 bg-accent-yellow/10 px-4 py-2 rounded-xl">
          <Flame className="text-accent-yellow" size={24} />
          <div>
            <p className="text-accent-yellow font-mono font-bold text-xl">{streak}</p>
            <p className="text-text-secondary text-xs">días</p>
          </div>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-accent-green/10 to-accent-blue/10 p-4 rounded-xl border border-accent-green/20">
        <p className="text-text-primary italic font-body">"{quote}"</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-bg-secondary rounded-xl p-6 border border-border-color">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-text-primary flex items-center gap-2">
            <Target className="text-accent-green" size={20} />
            Progreso de Hoy
          </h2>
          <span className="text-accent-green font-mono font-bold text-2xl">{stats.percentage}%</span>
        </div>
        
        <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent-green to-accent-blue transition-all duration-500 progress-animate"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
        
        <p className="text-text-secondary text-sm mt-2">
          {stats.completed} de {stats.total} hábitos completados
        </p>
      </div>

      {/* Habits Grid */}
      <div>
        <h2 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
          <TrendingUp className="text-accent-green" size={20} />
          Hábitos
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {stats.habits.map((habit) => {
            const Icon = habitIcons[habit.id]
            const colorClass = habitColors[habit.id]
            
            return (
              <button
                key={habit.id}
                onClick={() => {
                  const moduleMap = {
                    morning: 'routines',
                    night: 'routines',
                    body: 'body',
                    meals: 'meals',
                    sleep: 'sleep',
                  }
                  setActiveModule(moduleMap[habit.id] || habit.id)
                }}
                className={`
                  bg-bg-secondary rounded-xl p-4 border transition-all card-hover
                  ${habit.completed 
                    ? 'border-accent-green/30' 
                    : 'border-border-color'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-${colorClass}/10`}>
                    <Icon className={`text-${colorClass}`} size={20} />
                  </div>
                  <div className={`w-3 h-3 rounded-full ${habit.completed ? 'bg-accent-green' : 'bg-text-tertiary'}`} />
                </div>
                <p className="text-text-primary font-medium text-sm">{habit.name}</p>
                <p className={`text-xs mt-1 ${habit.completed ? 'text-accent-green' : 'text-text-tertiary'}`}>
                  {habit.completed ? 'Completado' : 'Pendiente'}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-bg-secondary rounded-xl p-6 border border-border-color">
        <h2 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Calendar className="text-accent-blue" size={20} />
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
                domain={[0, 100]} 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#12121a',
                  border: '1px solid #2a2a3a',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value) => [`${value}%`, 'Completado']}
              />
              <Bar 
                dataKey="percentage" 
                fill="#00ff88" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <Trophy className="text-accent-yellow mb-2" size={24} />
          <p className="text-text-secondary text-xs">Mejor racha</p>
          <p className="text-text-primary font-mono font-bold text-xl">{streak}</p>
        </div>
        
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <Droplets className="text-accent-blue mb-2" size={24} />
          <p className="text-text-secondary text-xs">Agua hoy</p>
          <p className="text-text-primary font-mono font-bold text-xl">
            {stats.water?.amount || 0}ml
          </p>
        </div>
        
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <Dumbbell className="text-accent-purple mb-2" size={24} />
          <p className="text-text-secondary text-xs">Gym</p>
          <p className="text-text-primary font-mono font-bold text-xl">
            {stats.gym?.completed ? '✓' : '—'}
          </p>
        </div>
        
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <Skull className="text-accent-orange mb-2" size={24} />
          <p className="text-text-secondary text-xs">Sin azúcar</p>
          <p className="text-text-primary font-mono font-bold text-xl">
            {stats.sugar?.hadSugar === false ? '✓' : stats.sugar?.hadSugar === true ? '✗' : '—'}
          </p>
        </div>
        
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <Utensils className="text-accent-green mb-2" size={24} />
          <p className="text-text-secondary text-xs">Comidas</p>
          <p className="text-text-primary font-mono font-bold text-xl">
            {stats.meals?.length || 0}
          </p>
        </div>
        
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <Moon className="text-accent-purple mb-2" size={24} />
          <p className="text-text-secondary text-xs">Sueño</p>
          <p className="text-text-primary font-mono font-bold text-xl">
            {stats.sleep?.duration ? `${stats.sleep.duration.hours}h ${stats.sleep.duration.minutes}m` : '—'}
          </p>
        </div>
        
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <Scale className="text-accent-yellow mb-2" size={24} />
          <p className="text-text-secondary text-xs">Peso</p>
          <p className="text-text-primary font-mono font-bold text-xl">
            {stats.body?.weight ? `${stats.body.weight}kg` : '—'}
          </p>
        </div>
      </div>
    </div>
  )
}
