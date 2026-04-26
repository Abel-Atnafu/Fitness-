import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { api } from '../api/client.js'
import { rememberAccount } from '../utils/knownAccounts.js'

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
  const [todayLog, setTodayLog] = useState({ foodEntries: [], exerciseEntries: [], waterGlasses: 0, mealsEaten: {} })
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

  // Bug 8 fix: always-current profile ref for logWeight
  const profileRef = useRef(profile)
  useEffect(() => { profileRef.current = profile }, [profile])

  // Bug 7 fix: debounced water sync to avoid race on rapid taps
  const waterSyncTimer = useRef(null)
  function syncWater(glasses) {
    clearTimeout(waterSyncTimer.current)
    waterSyncTimer.current = setTimeout(() => {
      api.put('/api/logs/water', { date: todayKey, glasses }).catch(() => {})
    }, 400)
  }

  useEffect(() => {
    if (!token) { setLoading(false); return }
    loadAllData()
  }, [token])

  async function loadAllData() {
    setLoading(true)
    try {
      const [prof, log, weights, history, exercise] = await Promise.all([
        api.get('/api/profile'),
        api.get(`/api/logs/${todayKey}`),
        api.get('/api/weight'),
        api.get('/api/logs?days=30'),
        api.get(`/api/exercise?date=${todayKey}`),
      ])
      setProfile({
        name: prof.name,
        email: prof.email,
        age: prof.age,
        heightCm: prof.height_cm,
        currentWeightKg: prof.current_weight_kg,
        goalWeightKg: prof.goal_weight_kg,
        dailyCalorieTarget: prof.daily_calorie_target,
        sex: prof.sex ?? null,
        activityLevel: prof.activity_level ?? 'sedentary',
        goalType: prof.goal_type ?? 'lose',
        weeklyRateKg: prof.weekly_rate_kg ?? 0.5,
        dietaryPreferences: prof.dietary_preferences ?? [],
        allergies: prof.allergies ?? [],
      })
      setTodayLog({
        foodEntries: log.foodEntries,
        exerciseEntries: exercise ?? [],
        waterGlasses: log.waterGlasses,
        mealsEaten: log.mealsEaten,
      })
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

  async function login(email, password, remember = true) {
    setAuthLoading(true)
    setError(null)
    try {
      const { token: t, user: u } = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('fitethio-token', t)
      setUser(u)
      setToken(t)
      if (remember) rememberAccount({ email: u.email, name: u.name })
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setAuthLoading(false)
    }
  }

  async function register(name, email, phone, password, remember = true) {
    setAuthLoading(true)
    setError(null)
    try {
      const { token: t, user: u } = await api.post('/api/auth/register', { name, email, phone, password })
      localStorage.setItem('fitethio-token', t)
      setUser(u)
      setToken(t)
      if (remember) rememberAccount({ email: u.email, name: u.name })
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setAuthLoading(false)
    }
  }

  async function forgotPassword(email) {
    await api.post('/api/auth/forgot-password', { email })
  }

  async function resetPassword(token, password) {
    await api.post('/api/auth/reset-password', { token, password })
  }

  function logout() {
    localStorage.removeItem('fitethio-token')
    setToken(null)
    setUser(null)
    setProfile(null)
    setTodayLog({ foodEntries: [], exerciseEntries: [], waterGlasses: 0, mealsEaten: {} })
    setWeightEntries([])
    setRecentHistory([])
    setCurrentStreak(0)
    setLoading(false)
  }

  async function logFood(food) {
    // Bug 4 fix: use crypto.randomUUID() to avoid rare same-ms collisions
    const optimisticId = crypto.randomUUID()
    const optimistic = { id: optimisticId, ...food, time: new Date().toISOString() }
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
        foodEntries: prev.foodEntries.map(e => e.id === optimisticId ? entry : e),
      }))
      // Bug 6 fix: update recentHistory for today and recalculate streak
      setRecentHistory(prev => {
        const existing = prev.find(h => h.date === todayKey)
        const newCalories = (existing?.totalCalories ?? 0) + (entry.calories ?? 0)
        const updated = existing
          ? prev.map(h => h.date === todayKey ? { ...h, totalCalories: newCalories } : h)
          : [...prev, { date: todayKey, totalCalories: newCalories }]
        setCurrentStreak(calcStreak(updated))
        return updated
      })
    } catch (err) {
      setTodayLog(prev => ({ ...prev, foodEntries: prev.foodEntries.filter(e => e.id !== optimisticId) }))
      setError(err.message || 'Failed to log food')
    }
  }

  async function deleteFood(id) {
    const snapshot = todayLog.foodEntries
    const removed = snapshot.find(e => e.id === id)
    setTodayLog(prev => ({ ...prev, foodEntries: prev.foodEntries.filter(e => e.id !== id) }))
    try {
      await api.delete(`/api/logs/food/${id}`)
      // Update recentHistory for today when deleting food
      if (removed) {
        setRecentHistory(prev => {
          const updated = prev.map(h =>
            h.date === todayKey
              ? { ...h, totalCalories: Math.max(0, h.totalCalories - (removed.calories ?? 0)) }
              : h
          )
          setCurrentStreak(calcStreak(updated))
          return updated
        })
      }
    } catch (err) {
      setTodayLog(prev => ({ ...prev, foodEntries: snapshot }))
      setError(err.message || 'Failed to delete food entry')
    }
  }

  async function logExercise(ex) {
    const optimisticId = crypto.randomUUID()
    setTodayLog(prev => ({ ...prev, exerciseEntries: [...(prev.exerciseEntries ?? []), { id: optimisticId, ...ex }] }))
    try {
      const entry = await api.post('/api/exercise', { date: todayKey, ...ex })
      setTodayLog(prev => ({
        ...prev,
        exerciseEntries: prev.exerciseEntries.map(e => e.id === optimisticId ? entry : e),
      }))
    } catch (err) {
      setTodayLog(prev => ({ ...prev, exerciseEntries: prev.exerciseEntries.filter(e => e.id !== optimisticId) }))
      setError(err.message || 'Failed to log exercise')
    }
  }

  async function deleteExercise(id) {
    const snapshot = todayLog.exerciseEntries
    setTodayLog(prev => ({ ...prev, exerciseEntries: prev.exerciseEntries.filter(e => e.id !== id) }))
    try {
      await api.delete(`/api/exercise/${id}`)
    } catch (err) {
      setTodayLog(prev => ({ ...prev, exerciseEntries: snapshot }))
      setError(err.message || 'Failed to delete exercise entry')
    }
  }

  async function toggleMealEaten(slot) {
    const eaten = !todayLog.mealsEaten?.[slot]
    setTodayLog(prev => ({ ...prev, mealsEaten: { ...prev.mealsEaten, [slot]: eaten } }))
    try {
      await api.put('/api/logs/meal', { date: todayKey, slot, eaten })
    } catch (err) {
      setTodayLog(prev => ({ ...prev, mealsEaten: { ...prev.mealsEaten, [slot]: !eaten } }))
      setError(err.message || 'Failed to update meal')
    }
  }

  // Bug 7 fix: logWater increments, decrementWater decrements, both debounce the API call
  async function logWater() {
    const glasses = Math.min((todayLog.waterGlasses ?? 0) + 1, 12)
    setTodayLog(prev => ({ ...prev, waterGlasses: glasses }))
    syncWater(glasses)
  }

  async function decrementWater() {
    const glasses = Math.max((todayLog.waterGlasses ?? 0) - 1, 0)
    setTodayLog(prev => ({ ...prev, waterGlasses: glasses }))
    syncWater(glasses)
  }

  async function logWeight(weight_kg) {
    setWeightEntries(prev =>
      [...prev.filter(e => e.date !== todayKey), { date: todayKey, weight: weight_kg }]
        .sort((a, b) => a.date.localeCompare(b.date))
    )
    setProfile(prev => ({ ...prev, currentWeightKg: weight_kg }))
    try {
      await api.post('/api/weight', { date: todayKey, weight_kg })
      // Bug 8 fix: read from profileRef to avoid stale closure
      const p = profileRef.current
      const result = await api.put('/api/profile', {
        name: p?.name,
        age: p?.age,
        height_cm: p?.heightCm,
        current_weight_kg: weight_kg,
        goal_weight_kg: p?.goalWeightKg,
      })
      setProfile(prev => ({ ...prev, dailyCalorieTarget: result.daily_calorie_target }))
    } catch (err) {
      setError(err.message || 'Failed to log weight')
    }
  }

  async function updateProfile(data) {
    try {
      const payload = {
        name: data.name,
        age: data.age,
        height_cm: data.heightCm,
        current_weight_kg: data.currentWeightKg,
        goal_weight_kg: data.goalWeightKg,
      }
      if (data.sex !== undefined) payload.sex = data.sex
      if (data.activityLevel !== undefined) payload.activity_level = data.activityLevel
      if (data.goalType !== undefined) payload.goal_type = data.goalType
      if (data.dietaryPreferences !== undefined) payload.dietary_preferences = data.dietaryPreferences
      if (data.allergies !== undefined) payload.allergies = data.allergies
      if (data.weeklyRateKg !== undefined) payload.weekly_rate_kg = data.weeklyRateKg
      const result = await api.put('/api/profile', payload)
      setProfile(prev => ({ ...prev, ...data, dailyCalorieTarget: result.daily_calorie_target }))
    } catch (err) {
      setError('Failed to update profile')
      throw err
    }
  }

  async function resetData() {
    try {
      await api.delete('/api/profile/data')
      setTodayLog({ foodEntries: [], exerciseEntries: [], waterGlasses: 0, mealsEaten: {} })
      setWeightEntries([])
      setRecentHistory([])
      setCurrentStreak(0)
    } catch (err) {
      setError('Reset failed')
    }
  }

  function swapMeal(day, slot) {
    const key = `${day}-${slot}`
    setMealSwapIndices(prev => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }))
  }

  const todayCalories = todayLog.foodEntries.reduce((s, e) => s + (e.calories ?? 0), 0)
  const todayCaloriesBurned = (todayLog.exerciseEntries ?? []).reduce((s, e) => s + (e.calories_burned ?? 0), 0)
  const calorieDeficit = (profile?.dailyCalorieTarget ?? 1900) - todayCalories + todayCaloriesBurned
  const bmi = profile ? +(profile.currentWeightKg / ((profile.heightCm / 100) ** 2)).toFixed(1) : 0
  const mealsCompletedToday = Object.values(todayLog.mealsEaten ?? {}).filter(Boolean).length

  return (
    <AppContext.Provider value={{
      token, user, login, register, forgotPassword, resetPassword, logout, authLoading,
      profile, todayLog, weightEntries, recentHistory, currentStreak,
      logFood, deleteFood, toggleMealEaten, logWater, decrementWater, logWeight,
      logExercise, deleteExercise,
      updateProfile, resetData,
      activeMealPlanDay, setActiveMealPlanDay, mealSwapIndices, swapMeal,
      loading, error, setError, todayKey,
      todayCalories, todayCaloriesBurned, calorieDeficit, bmi, mealsCompletedToday,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
