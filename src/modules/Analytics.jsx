import React from 'react'
import { useStore } from '../store/useStore'
import { BarChart3, TrendingUp, Trophy, Calendar, Droplets, Dumbbell, Skull, Flame, Utensils, Moon, Scale } from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'

const COLORS = {
  water: '#00d4ff',
  gym: '#a855f7',
  sugar: '#ff6b35',
  meals: '#00ff88',
  sleep: '#a855f7',
  body: '#ffd700',
}

export default function Analytics() {
  const { 
    getWeeklyData, 
    getMonthlyData, 
    calculateStreak, 
    getSugarStreak,
    waterData,
    gymData,
    sugarData,
    mealsData,
    sleepData,
    bodyMeasurementsData,
    settings 
  } = useStore()
  
  const today = new Date().toISOString().split('T')[0]
  const streak = calculateStreak()
  const sugarStreak = getSugarStreak()
  
  const weeklyData = getWeeklyData()
  const monthlyData = getMonthlyData()
  
  // Calculate completion rates
  const completedDays = weeklyData.filter(d => d.percentage > 0).length
  const avgCompletion = Math.round(weeklyData.reduce((acc, d) => acc + d.percentage, 0) / 7)
  
  // Monthly stats (now with 8 habits)
  const monthDays = monthlyData.filter(d => d.date <= today).length
  const monthAvg = Math.round(monthlyData
    .filter(d => d.date <= today)
    .reduce((acc, d) => acc + d.completed, 0) / monthDays * 12.5) || 0
  
  // Habit-specific stats
  const habitStats = [
    { 
      name: 'Agua', 
      icon: Droplets, 
      color: COLORS.water,
      current: waterData[today]?.amount || 0,
      goal: settings.waterGoal,
      rate: Math.round(((waterData[today]?.amount || 0) / settings.waterGoal) * 100),
    },
    { 
      name: 'Gym', 
      icon: Dumbbell, 
      color: COLORS.gym,
      current: gymData[today]?.completed ? 1 : 0,
      goal: 1,
      rate: gymData[today]?.completed ? 100 : 0,
    },
    { 
      name: 'Sin Azúcar', 
      icon: Skull, 
      color: COLORS.sugar,
      current: sugarData[today]?.hadSugar === false ? 1 : 0,
      goal: 1,
      rate: sugarData[today]?.hadSugar === false ? 100 : sugarData[today]?.hadSugar === true ? 0 : 0,
    },
    { 
      name: 'Comidas', 
      icon: Utensils, 
      color: COLORS.meals,
      current: mealsData[today]?.length || 0,
      goal: 3,
      rate: Math.round(((mealsData[today]?.length || 0) / 3) * 100),
    },
    { 
      name: 'Sueño', 
      icon: Moon, 
      color: COLORS.sleep,
      current: sleepData[today]?.duration?.totalMinutes || 0,
      goal: 480, // 8 horas
      rate: Math.round(((sleepData[today]?.duration?.totalMinutes || 0) / 480) * 100),
    },
    { 
      name: 'Medidas', 
      icon: Scale, 
      color: COLORS.body,
      current: bodyMeasurementsData[today]?.weight ? 1 : 0,
      goal: 1,
      rate: bodyMeasurementsData[today]?.weight ? 100 : 0,
    },
  ]
  
  // Radar chart data
  const radarData = habitStats.map(h => ({
    subject: h.name,
    value: h.rate,
    fullMark: 100,
  }))
  
  // Monthly trend data (now with 8 habits)
  const monthlyTrend = monthlyData.map(d => ({
    ...d,
    percentage: Math.round((d.completed / 8) * 100),
  }))

  return (
    <div className="fade-in space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-accent-green/10 rounded-xl">
          <BarChart3 className="text-accent-green" size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Analytics</h1>
          <p className="text-text-secondary text-sm">Tu progreso en datos</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <Trophy className="text-accent-yellow mb-2" size={24} />
          <p className="text-text-secondary text-xs">Racha actual</p>
          <p className="text-2xl font-mono font-bold text-text-primary">{streak}</p>
        </div>
        
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <Flame className="text-accent-green mb-2" size={24} />
          <p className="text-text-secondary text-xs">Sin azúcar</p>
          <p className="text-2xl font-mono font-bold text-text-primary">{sugarStreak}</p>
        </div>
        
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <TrendingUp className="text-accent-blue mb-2" size={24} />
          <p className="text-text-secondary text-xs">Esta semana</p>
          <p className="text-2xl font-mono font-bold text-text-primary">{avgCompletion}%</p>
        </div>
        
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <Calendar className="text-accent-purple mb-2" size={24} />
          <p className="text-text-secondary text-xs">Este mes</p>
          <p className="text-2xl font-mono font-bold text-text-primary">{monthAvg}%</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-bg-secondary rounded-xl p-6 border border-border-color">
        <h2 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
          <TrendingUp className="text-accent-green" size={20} />
          Rendimiento Semanal
        </h2>
        
        <div className="h-48">
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

      {/* Habit Performance Radar */}
      <div className="bg-bg-secondary rounded-xl p-6 border border-border-color">
        <h2 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
          <BarChart3 className="text-accent-purple" size={20} />
          Rendimiento por Hábito
        </h2>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#2a2a3a" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b8b9a', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Rendimiento"
                dataKey="value"
                stroke="#00ff88"
                fill="#00ff88"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual Habit Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {habitStats.map((habit) => {
          const Icon = habit.icon
          
          return (
            <div key={habit.name} className="bg-bg-secondary rounded-xl p-4 border border-border-color">
              <div className="flex items-center gap-2 mb-3">
                <Icon style={{ color: habit.color }} size={20} />
                <span className="text-text-primary font-medium">{habit.name}</span>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">Hoy</span>
                  <span className="text-text-primary font-mono">
                    {habit.name === 'Agua' ? `${habit.current}ml` : 
                     habit.name === 'Sueño' ? `${Math.floor(habit.current / 60)}h ${habit.current % 60}m` :
                     `${habit.current}/${habit.goal}`}
                  </span>
                </div>
                <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all"
                    style={{ 
                      width: `${Math.min(100, habit.rate)}%`,
                      backgroundColor: habit.color 
                    }}
                  />
                </div>
              </div>
              
              <p className="text-xs text-text-tertiary">
                {habit.rate}% de meta
              </p>
            </div>
          )
        })}
      </div>

      {/* Monthly Trend */}
      <div className="bg-bg-secondary rounded-xl p-6 border border-border-color">
        <h2 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Calendar className="text-accent-blue" size={20} />
          Tendencia Mensual
        </h2>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#8b8b9a', fontSize: 10 }}
                interval={4}
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
              <Line 
                type="monotone" 
                dataKey="percentage" 
                stroke="#00d4ff" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#00d4ff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div className="bg-bg-secondary rounded-xl p-6 border border-border-color">
        <h2 className="text-lg font-heading font-semibold text-text-primary mb-4">
          Calendario - Últimos 30 días
        </h2>
        
        <div className="grid grid-cols-10 gap-1">
          {monthlyData.map((day, i) => {
            const intensity = Math.round((day.completed / 8) * 100)
            let bgClass = 'bg-bg-tertiary'
            
            if (intensity === 100) bgClass = 'bg-accent-green'
            else if (intensity >= 66) bgClass = 'bg-accent-green/60'
            else if (intensity >= 33) bgClass = 'bg-accent-green/30'
            else if (intensity > 0) bgClass = 'bg-accent-green/10'
            
            return (
              <div
                key={i}
                className={`aspect-square rounded ${bgClass}`}
                title={`${day.date}: ${intensity}%`}
              />
            )
          })}
        </div>
        
        <div className="flex gap-2 mt-4 justify-center">
          <span className="text-text-tertiary text-xs">Menos</span>
          <div className="w-3 h-3 rounded bg-bg-tertiary" />
          <div className="w-3 h-3 rounded bg-accent-green/10" />
          <div className="w-3 h-3 rounded bg-accent-green/30" />
          <div className="w-3 h-3 rounded bg-accent-green/60" />
          <div className="w-3 h-3 rounded bg-accent-green" />
          <span className="text-text-tertiary text-xs">Más</span>
        </div>
      </div>
    </div>
  )
}
