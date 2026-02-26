import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Utensils, Plus, Trash2, Edit2, Search, Clock, Flame } from 'lucide-react'

const foodDatabase = [
  { name: 'Arroz blanco', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, category: 'Carbohidratos' },
  { name: 'Pollo a la parrilla', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'Proteínas' },
  { name: 'Pasta', calories: 131, protein: 5.1, carbs: 25.2, fat: 1.1, category: 'Carbohidratos' },
  { name: 'Huevo', calories: 155, protein: 13, carbs: 1.1, fat: 11, category: 'Proteínas' },
  { name: 'Lechuga', calories: 16, protein: 1.2, carbs: 3.6, fat: 0.2, category: 'Verduras' },
  { name: 'Tomate', calories: 22, protein: 1, carbs: 4.8, fat: 0.2, category: 'Verduras' },
  { name: 'Manzana', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, category: 'Frutas' },
  { name: 'Plátano', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, category: 'Frutas' },
  { name: 'Aguacate', calories: 160, protein: 2, carbs: 9, fat: 15, category: 'Grasas' },
  { name: 'Yogur griego', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, category: 'Lácteos' },
  { name: 'Pan integral', calories: 250, protein: 9, carbs: 45, fat: 3, category: 'Carbohidratos' },
  { name: 'Pescado blanco', calories: 106, protein: 22, carbs: 0, fat: 1.3, category: 'Proteínas' },
]

export default function Meals() {
  const { mealsData, addMeal, removeMeal, updateMeal } = useStore()
  
  const today = new Date().toISOString().split('T')[0]
  const todayMeals = mealsData[today] || []

  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFood, setSelectedFood] = useState(null)
  const [quantity, setQuantity] = useState(100)
  const [mealType, setMealType] = useState('almuerzo')
  const [notes, setNotes] = useState('')

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const calculateNutrition = (food, qty) => {
    const multiplier = qty / 100
    return {
      calories: Math.round(food.calories * multiplier),
      protein: Math.round(food.protein * multiplier),
      carbs: Math.round(food.carbs * multiplier),
      fat: Math.round(food.fat * multiplier),
    }
  }

  const handleSubmit = () => {
    if (selectedFood) {
      const nutrition = calculateNutrition(selectedFood, quantity)
      addMeal({
        ...selectedFood,
        ...nutrition,
        quantity,
        mealType,
        notes,
      })
      resetForm()
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setSearchQuery('')
    setSelectedFood(null)
    setQuantity(100)
    setMealType('almuerzo')
    setNotes('')
  }

  const totalNutrition = todayMeals.reduce((total, meal) => {
    return {
      calories: total.calories + meal.calories,
      protein: total.protein + meal.protein,
      carbs: total.carbs + meal.carbs,
      fat: total.fat + meal.fat,
    }
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 })

  return (
    <div className="fade-in space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent-blue/10 rounded-xl">
            <Utensils className="text-accent-blue" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary">Comidas</h1>
            <p className="text-text-secondary text-sm">Rastrea tu nutrición</p>
          </div>
        </div>
      </div>

      {/* Nutrition Summary */}
      <div className="bg-bg-secondary rounded-xl p-6 border border-border-color">
        <h2 className="text-lg font-heading font-semibold text-text-primary mb-4">Resumen nutricional del día</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-bg-tertiary rounded-lg">
            <Flame className="text-accent-orange mx-auto mb-2" size={20} />
            <p className="text-2xl font-mono font-bold text-text-primary">{totalNutrition.calories}</p>
            <p className="text-text-secondary text-sm">Calorías</p>
          </div>
          <div className="text-center p-4 bg-bg-tertiary rounded-lg">
            <Utensils className="text-accent-blue mx-auto mb-2" size={20} />
            <p className="text-2xl font-mono font-bold text-text-primary">{totalNutrition.protein}g</p>
            <p className="text-text-secondary text-sm">Proteínas</p>
          </div>
          <div className="text-center p-4 bg-bg-tertiary rounded-lg">
            <Clock className="text-accent-green mx-auto mb-2" size={20} />
            <p className="text-2xl font-mono font-bold text-text-primary">{totalNutrition.carbs}g</p>
            <p className="text-text-secondary text-sm">Carbs</p>
          </div>
          <div className="text-center p-4 bg-bg-tertiary rounded-lg">
            <Utensils className="text-accent-purple mx-auto mb-2" size={20} />
            <p className="text-2xl font-mono font-bold text-text-primary">{totalNutrition.fat}g</p>
            <p className="text-text-secondary text-sm">Grasas</p>
          </div>
        </div>
      </div>

      {/* Today's Meals */}
      <div className="bg-bg-secondary rounded-xl p-6 border border-border-color">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-text-primary">Comidas de hoy</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-accent-blue text-white font-bold px-4 py-2 rounded-lg hover:bg-accent-blue/80 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Agregar comida
          </button>
        </div>

        {todayMeals.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            No hay comidas registradas para hoy
          </div>
        ) : (
          <div className="space-y-3">
            {todayMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-bg-tertiary rounded-lg p-4 flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-blue/10 rounded-lg flex items-center justify-center">
                    <Utensils className="text-accent-blue" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{meal.name}</h3>
                    <p className="text-text-secondary text-sm">{meal.quantity}g • {meal.mealType}</p>
                    <p className="text-text-tertiary text-xs">
                      {meal.calories} kcal • {meal.protein}g P • {meal.carbs}g C • {meal.fat}g G
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedFood(meal)
                      setQuantity(meal.quantity)
                      setMealType(meal.mealType)
                      setNotes(meal.notes)
                      setShowForm(true)
                    }}
                    className="text-text-secondary hover:text-accent-blue transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => removeMeal(meal.id)}
                    className="text-text-secondary hover:text-accent-red transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Meal Form */}
      {showForm && (
        <div className="bg-bg-secondary rounded-xl p-6 border border-accent-blue/30 animate-fade-in">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
            {selectedFood ? 'Editar comida' : 'Agregar comida'}
          </h3>

          {/* Food Search */}
          <div className="mb-4">
            <label className="text-text-secondary text-sm block mb-2">Buscar alimento</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar alimento..."
                className="w-full bg-bg-tertiary border border-border-color rounded-lg px-10 py-3 text-text-primary focus:outline-none focus:border-accent-blue"
              />
            </div>
          </div>

          {/* Food List */}
          {filteredFoods.length > 0 && (
            <div className="mb-4 max-h-40 overflow-y-auto">
              {filteredFoods.map((food) => (
                <div
                  key={food.name}
                  onClick={() => setSelectedFood(food)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedFood?.name === food.name
                      ? 'bg-accent-blue/10 border border-accent-blue'
                      : 'bg-bg-tertiary hover:bg-bg-primary'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-text-primary">{food.name}</span>
                    <span className="text-text-secondary text-sm">{food.calories} kcal/100g</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity */}
          {selectedFood && (
            <div className="mb-4">
              <label className="text-text-secondary text-sm block mb-2">Cantidad (gr)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full bg-bg-tertiary border border-border-color rounded-lg px-4 py-3 text-text-primary font-mono focus:outline-none focus:border-accent-blue"
              />
            </div>
          )}

          {/* Meal Type */}
          <div className="mb-4">
            <label className="text-text-secondary text-sm block mb-2">Tipo de comida</label>
            <div className="grid grid-cols-4 gap-2">
              {['desayuno', 'almuerzo', 'merienda', 'cena'].map((type) => (
                <button
                  key={type}
                  onClick={() => setMealType(type)}
                  className={`
                    py-2 px-3 rounded-lg border text-sm font-medium transition-all
                    ${mealType === type 
                      ? 'bg-accent-blue/10 border-accent-blue text-accent-blue' 
                      : 'bg-bg-tertiary border-border-color text-text-secondary hover:border-text-tertiary'
                    }
                  `}
                >
                  {type}
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
              placeholder="Ej: con ensalada..."
              rows={3}
              className="w-full bg-bg-tertiary border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-blue resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={resetForm}
              className="flex-1 bg-bg-tertiary border border-border-color text-text-secondary py-3 rounded-xl hover:bg-bg-primary transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedFood}
              className="flex-1 bg-accent-blue text-white font-bold py-3 rounded-xl hover:bg-accent-blue/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedFood ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}