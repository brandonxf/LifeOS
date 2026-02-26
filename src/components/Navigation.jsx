import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { LayoutDashboard, Droplets, Dumbbell, Skull, SunMoon, BarChart3, Utensils, Moon, Scale, Menu, X } from 'lucide-react'

const modules = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'water', label: 'Agua', icon: Droplets },
  { id: 'gym', label: 'Gym', icon: Dumbbell },
  { id: 'sugar', label: 'Azúcar', icon: Skull },
  { id: 'meals', label: 'Comidas', icon: Utensils },
  { id: 'sleep', label: 'Sueño', icon: Moon },
  { id: 'body', label: 'Medidas', icon: Scale },
  { id: 'routines', label: 'Rutinas', icon: SunMoon },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

export default function Navigation() {
  const { activeModule, setActiveModule } = useStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <>
      {/* Desktop Sidebar - Minimalist & Wide */}
      <nav className="hidden md:flex flex-col w-64 bg-bg-secondary/80 backdrop-blur-xl border-r border-white/5 h-full fixed left-0 top-0 z-50">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-accent-green/60 flex items-center justify-center shadow-lg shadow-accent-green/20">
              <span className="text-bg-primary font-heading font-bold text-xl">L</span>
            </div>
            <div>
              <h1 className="text-lg font-heading font-bold text-text-primary">Life OS</h1>
              <p className="text-xs text-text-tertiary">v1.0</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Items */}
        <div className="flex-1 px-3 py-6 space-y-1">
          {modules.map((module) => {
            const Icon = module.icon
            const isActive = activeModule === module.id
            
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-accent-green/10 text-accent-green' 
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                  }
                `}
              >
                <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-accent-green/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                  <Icon size={18} />
                </div>
                <span className="font-medium text-sm">{module.label}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-green" />
                )}
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="bg-gradient-to-r from-accent-green/10 to-accent-blue/10 rounded-xl p-4">
            <p className="text-xs text-text-secondary leading-relaxed">
              "La disciplina es el puente entre tus metas y tus logros."
            </p>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <div className={`md:hidden fixed top-0 left-0 p-4 z-[60] ${isMenuOpen ? 'hidden' : 'block'}`}>
        <button
          onClick={toggleMenu}
          className="bg-bg-secondary/90 backdrop-blur-xl p-2 rounded-lg border border-white/5 text-text-primary"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />
      
      {/* Menu */}
      <nav className={`fixed top-0 left-0 h-full w-64 bg-bg-secondary/95 backdrop-blur-xl border-r border-white/5 z-50 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {/* Logo */}
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-accent-green/60 flex items-center justify-center shadow-lg shadow-accent-green/20">
                  <span className="text-bg-primary font-heading font-bold text-xl">L</span>
                </div>
                <div>
                  <h1 className="text-lg font-heading font-bold text-text-primary">Life OS</h1>
                  <p className="text-xs text-text-tertiary">v1.0</p>
                </div>
              </div>
            </div>
            
            {/* Navigation Items */}
            <div className="flex-1 px-3 py-6 space-y-1">
              {modules.map((module) => {
                const Icon = module.icon
                const isActive = activeModule === module.id
                
                return (
                  <button
                    key={module.id}
                    onClick={() => {
                      setActiveModule(module.id)
                      setIsMenuOpen(false)
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                      ${isActive 
                        ? 'bg-accent-green/10 text-accent-green' 
                        : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                      }
                    `}
                  >
                    <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-accent-green/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                      <Icon size={18} />
                    </div>
                    <span className="font-medium text-sm">{module.label}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-green" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
              <div className="bg-gradient-to-r from-accent-green/10 to-accent-blue/10 rounded-xl p-4">
                <p className="text-xs text-text-secondary leading-relaxed">
                  "La disciplina es el puente entre tus metas y tus logros."
                </p>
              </div>
            </div>
      </nav>

      {/* Mobile Content Padding */}
      <div className="md:hidden pt-16" />
    </>
  )
}
