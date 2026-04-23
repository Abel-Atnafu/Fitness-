import { createContext, useContext, useState, useEffect } from 'react'
import { format } from 'date-fns'
import { api } from '../api/client.js'

const AppContext = createContext(null)
const todayKey = format(new Date(), 'yyyy-MM-dd')

function calcStreak(history) {
  const map = Object.fromEntries(history.map(h => [h.date, h.totalCalories]))
  let streak = 0
  for (let i = 1; i <= 365; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    if (map[format(d, 'yyyy-MM-dd')] > 0) streak++
    else break
  }
  return streak
}

export function AppProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('fitethio-token'))
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [todayLog, setTodayLog] = useState({ foodEntries: [], waterGlasses: 0, mealsEaten: {} })
  const [weightEntries, setWeightEntries] = useState([])
  const [recentHistory, setRecentHistory] = useState([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [activeMealPlanDay, setActiveMealPlanDay] = useState(
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  )
  const [mealSwapIndices, setMealSwapIndices] = useState({})
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) { setLoading(false); return }
    loadAllData()
  }, [token])

  async function loadAllData() {
    setLoading(true)
    try {
      const [prof, log, weights, history] = await Promise.all([
        api.get('/api/profile'),
        api.get(`/api/logs/${todayKey}`),
        api.get('/api/weight'),
        api.get('/api/logs?days=30'),
      ])
      setProfile({
        name: prof.name,
        email: prof.email,
        age: prof.age,
        heightCm: prof.height_cm,
        currentWeightKg: prof.current_weight_kg,
        goalWeightKg: prof.goal_weight_kg,
        dailyCalorieTarget: prof.daily_calorie_target,
      })
      setTodayLog({ foodEntries: log.foodEntries, waterGlasses: log.waterGlasses, mealsEaten: log.mealsEaten })
      setWeightEntries(weights.map(w => ({ date: w.date, weight: w.weight_kg })))
      setRecentHistory(history)
      setCurrentStreak(calcStreak(history))
    } catch (err) {
      if (err.status === 401) { logout(); return }
      setError('Failed to load data. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password) {
    setAuthLoading(true)
    setError(null)
    try {
      const { token: t, user: u } = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('fitethio-token', t)
      setUser(u)
      setToken(t)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setAuthLoading(false)
    }
  }

  async function register(name, email, password) {
    setAuthLoading(true)
    setError(null)
    try {
      const { token: t, user: u } = await api.post('/api/auth/register', { name, email, password })
      localStorage.setItem('fitethio-token', t)
      setUser(u)
      setToken(t)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setAuthLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('fitethio-token')
    setToken(null)
    setUser(null)
    setProfile(null)
    setTodayLog({ foodEntries: [], waterGlasses: 0, mealsEaten: {} })
    setWeightEntries([])
    setRecentHistory([])
    setCurrentStreak(0)
    setLoading(false)
  }

  async function logFood(food) {
    const optimistic = { id: `opt-${Date.now()}`, ...food, time: new Date().toISOString() }
    setTodayLog(prev => ({ ...prev, foodEntries: [...prev.foodEntries, optimistic] }))
    try {
      const entry = await api.post('/api/logs/food', {
        date: todayKey,
        food_name: food.name,
        calories: food.calories,
        protein: food.protein ?? 0,
        carbs: food.carbs ?? 0,
        fat: food.fat ?? 0,
        emoji: food.emoji ?? '🍽️',
        category: food.category ?? 'Other',
      })
      setTodayLog(prev => ({
        ...prev,
        foodEntries: prev.foodEntries.map(e => e.id === optimistic.id ? entry : e),
      }))
    } catch {
      setTodayLog(prev => ({ ...prev, foodEntries: prev.foodEntries.filter(e => e.id !== optimistic.id) }))
    }
  }

  async function deleteFood(id) {
    const snapshot = todayLog.foodEntries
    setTodayLog(prev => ({ ...prev, foodEntries: prev.foodEntries.filter(e => e.id !== id) }))
    try { await api.delete(`/api/logs/food/${id}`) }
    catch { setTodayLog(prev => ({ ...prev, foodEntries: snapshot })) }
  }

  async function toggleMealEaten(slot) {
    const eaten = !todayLog.mealsEaten?.[slot]
    setTodayLog(prev => ({ ...prev, mealsEaten: { ...prev.mealsEaten, [slot]: eaten } }))
    try { await api.put('/api/logs/meal', { date: todayKey, slot, eaten }) }
    catch { setTodayLog(prev => ({ ...prev, mealsEaten: { ...prev.mealsEaten, [slot]: !eaten } })) }
  }

  async function logWater() {
    const glasses = Math.min((todayLog.waterGlasses ?? 0) + 1, 12)
    setTodayLog(prev => ({ ...prev, waterGlasses: glasses }))
    try { await api.put('/api/logs/water', { date: todayKey, glasses }) } catch {}
  }

  async function logWeight(weight_kg) {
    setWeightEntries(prev => [...prev.filter(e => e.date !== todayKey), { date: todayKey, weight: weight_kg }].sort((a, b) => a.date.localeCompare(b.date)))
    setProfile(prev => ({ ...prev, currentWeightKg: weight_kg }))
    try {
      await api.post('/api/weight', { date: todayKey, weight_kg })
      const result = await api.put('/api/profile', {
        name: profile?.name,
        age: profile?.age,
        height_cm: profile?.heightCm,
        current_weight_kg: weight_kg,
        goal_weight_kg: profile?.goalWeightKg,
      })
      setProfile(prev => ({ ...prev, dailyCalorieTarget: result.daily_calorie_target }))
    } catch {}
  }

  async function updateProfile(data) {
    try {
      const result = await api.put('/api/profile', {
        name: data.name,
        age: data.age,
        height_cm: data.heightCm,
        current_weight_kg: data.currentWeightKg,
        goal_weight_kg: data.goalWeightKg,
      })
      setProfile(prev => ({ ...prev, ...data, dailyCalorieTarget: result.daily_calorie_target }))
    } catch (err) {
      setError('Failed to update profile')
      throw err
    }
  }

  async function resetData() {
    try {
      await api.delete('/api/profile/data')
      setTodayLog({ foodEntries: [], waterGlasses: 0, mealsEaten: {} })
      setWeightEntries([])
      setRecentHistory([])
      setCurrentStreak(0)
    } catch { setError('Reset failed') }
  }

  function swapMeal(day, slot) {
    const key = `${day}-${slot}`
    setMealSwapIndices(prev => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }))
  }

  const todayCalories = todayLog.foodEntries.reduce((s, e) => s + (e.calories ?? 0), 0)
  const calorieDeficit = (profile?.dailyCalorieTarget ?? 1900) - todayCalories
  const bmi = profile ? +(profile.currentWeightKg / ((profile.heightCm / 100) ** 2)).toFixed(1) : 0
  const mealsCompletedToday = Object.values(todayLog.mealsEaten ?? {}).filter(Boolean).length

  return (
    <AppContext.Provider value={{
      token, user, login, register, logout, authLoading,
      profile, todayLog, weightEntries, recentHistory, currentStreak,
      logFood, deleteFood, toggleMealEaten, logWater, logWeight, updateProfile, resetData,
      activeMealPlanDay, setActiveMealPlanDay, mealSwapIndices, swapMeal,
      loading, error, setError, todayKey,
      todayCalories, calorieDeficit, bmi, mealsCompletedToday,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
