import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Settings as SettingsIcon, Moon, Sun, Bell, User, Shield, Palette } from 'lucide-react'

export default function Settings() {
  const { settings, updateSettings, updateNotificationSettings, updateNotificationIntervals, updateUserInfo } = useStore()

  const [activeSection, setActiveSection] = useState('general')

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Seguridad', icon: Shield },
  ]

  return (
    <div className="fade-in space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent-blue/10 rounded-xl">
            <SettingsIcon className="text-accent-blue" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary">Configuración</h1>
            <p className="text-text-secondary text-sm">Personaliza tu experiencia</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-bg-secondary rounded-xl border border-border-color p-4">
            <div className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm font-medium
                      ${activeSection === section.id
                        ? 'bg-accent-blue/10 text-accent-blue'
                        : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                      }
                    `}
                  >
                    <Icon size={18} />
                    {section.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <div className="bg-bg-secondary rounded-xl border border-border-color p-6">
            {activeSection === 'general' && (
              <div className="space-y-6">
                <h2 className="text-lg font-heading font-semibold text-text-primary">Configuración general</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-text-secondary text-sm block mb-2">Nombre de usuario</label>
                    <input
                      type="text"
                      value={settings.userName}
                      onChange={(e) => updateSettings({ userName: e.target.value })}
                      className="w-full bg-bg-tertiary border border-border-color rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                  
                  <div>
                    <label className="text-text-secondary text-sm block mb-2">Meta de agua (ml/día)</label>
                    <input
                      type="number"
                      value={settings.waterGoal}
                      onChange={(e) => updateSettings({ waterGoal: parseInt(e.target.value) })}
                      className="w-full bg-bg-tertiary border border-border-color rounded-lg px-4 py-3 text-text-primary font-mono focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-heading font-semibold text-text-primary">Notificaciones</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-primary">Recordatorio de agua</p>
                      <p className="text-text-secondary text-sm">Notifica cada {settings.notificationIntervals.water} minutos</p>
                    </div>
                    <button
                      onClick={() => updateNotificationSettings({ water: !settings.notifications.water })}
                      className={`
                        w-12 h-6 rounded-full transition-colors relative
                        ${settings.notifications.water ? 'bg-accent-green' : 'bg-bg-tertiary'}
                      `}
                    >
                      <div className={`
                        w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform
                        ${settings.notifications.water ? 'transform translate-x-6' : 'transform translate-x-0'}
                      `} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-primary">Recordatorio de comidas</p>
                      <p className="text-text-secondary text-sm">Notifica cada {settings.notificationIntervals.meal} minutos</p>
                    </div>
                    <button
                      onClick={() => updateNotificationSettings({ meal: !settings.notifications.meal })}
                      className={`
                        w-12 h-6 rounded-full transition-colors relative
                        ${settings.notifications.meal ? 'bg-accent-green' : 'bg-bg-tertiary'}
                      `}
                    >
                      <div className={`
                        w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform
                        ${settings.notifications.meal ? 'transform translate-x-6' : 'transform translate-x-0'}
                      `} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-primary">Recordatorio de sueño</p>
                      <p className="text-text-secondary text-sm">Notifica a las 22:00</p>
                    </div>
                    <button
                      onClick={() => updateNotificationSettings({ sleep: !settings.notifications.sleep })}
                      className={`
                        w-12 h-6 rounded-full transition-colors relative
                        ${settings.notifications.sleep ? 'bg-accent-green' : 'bg-bg-tertiary'}
                      `}
                    >
                      <div className={`
                        w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform
                        ${settings.notifications.sleep ? 'transform translate-x-6' : 'transform translate-x-0'}
                      `} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-primary">Recordatorio de gym</p>
                      <p className="text-text-secondary text-sm">Notifica a las 18:00</p>
                    </div>
                    <button
                      onClick={() => updateNotificationSettings({ gym: !settings.notifications.gym })}
                      className={`
                        w-12 h-6 rounded-full transition-colors relative
                        ${settings.notifications.gym ? 'bg-accent-green' : 'bg-bg-tertiary'}
                      `}
                    >
                      <div className={`
                        w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform
                        ${settings.notifications.gym ? 'transform translate-x-6' : 'transform translate-x-0'}
                      `} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border-color">
                  <div>
                    <label className="text-text-secondary text-sm block mb-2">Intervalo de agua (minutos)</label>
                    <input
                      type="number"
                      value={settings.notificationIntervals.water}
                      onChange={(e) => updateNotificationIntervals({ water: parseInt(e.target.value) })}
                      min="30"
                      max="360"
                      className="w-full bg-bg-tertiary border border-border-color rounded-lg px-4 py-3 text-text-primary font-mono focus:outline-none focus:border-accent-blue"
                    />
                  </div>

                  <div>
                    <label className="text-text-secondary text-sm block mb-2">Intervalo de comidas (minutos)</label>
                    <input
                      type="number"
                      value={settings.notificationIntervals.meal}
                      onChange={(e) => updateNotificationIntervals({ meal: parseInt(e.target.value) })}
                      min="60"
                      max="720"
                      className="w-full bg-bg-tertiary border border-border-color rounded-lg px-4 py-3 text-text-primary font-mono focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-lg font-heading font-semibold text-text-primary">Apariencia</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-text-secondary text-sm block mb-2">Tema</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'light', label: 'Claro', icon: Sun },
                        { value: 'dark', label: 'Oscuro', icon: Moon },
                        { value: 'auto', label: 'Auto', icon: Sun },
                      ].map((theme) => {
                        const Icon = theme.icon
                        return (
                          <button
                            key={theme.value}
                            onClick={() => updateSettings({ theme: theme.value })}
                            className={`
                              py-2 px-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2
                              ${settings.theme === theme.value
                                ? 'bg-accent-blue/10 border-accent-blue text-accent-blue'
                                : 'bg-bg-tertiary border-border-color text-text-secondary hover:border-text-tertiary'
                              }
                            `}
                          >
                            <Icon size={16} />
                            {theme.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-heading font-semibold text-text-primary">Información personal</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-text-secondary text-sm block mb-2">Edad</label>
                    <input
                      type="number"
                      value={settings.userInfo.age || ''}
                      onChange={(e) => updateUserInfo({ age: parseInt(e.target.value) || null })}
                      min="0"
                      max="120"
                      placeholder="30"
                      className="w-full bg-bg-tertiary border border-border-color rounded-lg px-4 py-3 text-text-primary font-mono focus:outline-none focus:border-accent-blue"
                    />
                  </div>

                  <div>
                    <label className="text-text-secondary text-sm block mb-2">Género</label>
                    <select
                      value={settings.userInfo.gender || ''}
                      onChange={(e) => updateUserInfo({ gender: e.target.value || null })}
                      className="w-full bg-bg-tertiary border border-border-color rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-blue"
                    >
                      <option value="">Selecciona...</option>
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-text-secondary text-sm block mb-2">Peso (kg)</label>
                    <input
                      type="number"
                      value={settings.userInfo.weight || ''}
                      onChange={(e) => updateUserInfo({ weight: parseFloat(e.target.value) || null })}
                      step="0.1"
                      placeholder="70"
                      className="w-full bg-bg-tertiary border border-border-color rounded-lg px-4 py-3 text-text-primary font-mono focus:outline-none focus:border-accent-blue"
                    />
                  </div>

                  <div>
                    <label className="text-text-secondary text-sm block mb-2">Altura (cm)</label>
                    <input
                      type="number"
                      value={settings.userInfo.height || ''}
                      onChange={(e) => updateUserInfo({ height: parseFloat(e.target.value) || null })}
                      step="0.1"
                      placeholder="170"
                      className="w-full bg-bg-tertiary border border-border-color rounded-lg px-4 py-3 text-text-primary font-mono focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-heading font-semibold text-text-primary">Seguridad</h2>
                
                <div className="space-y-4">
                  <div className="bg-bg-tertiary rounded-lg p-4">
                    <p className="text-text-secondary text-sm mb-2">Almacenamiento de datos</p>
                    <p className="text-text-primary">
                      Tus datos se almacenan localmente en tu navegador y se sincronizan con Firebase si estás conectado.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}