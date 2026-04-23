import { createContext, useContext, useReducer, useEffect, useMemo } from 'react'
import { format, subDays, parseISO } from 'date-fns'
import { useLocalStorage } from '../hooks/useLocalStorage'

const initialProfile = {
  name: 'Abel',
  gender: 'male',
  age: 22,
  heightCm: 185,
  currentWeightKg: 95,
  goalWeightKg: 80,
  activityLevel: 'sedentary',
  dailyCalorieTarget: 1900,
}

const initialState = {
  profile: initialProfile,
  dailyLogs: {},
  weightEntries: [],
  currentStreak: 0,
  activeMealPlanDay: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
  mealSwapIndices: {},
  ui: { theme: 'dark' },
}

function calcCalorieTarget(profile) {
  const bmr = 10 * profile.currentWeightKg + 6.25 * profile.heightCm - 5 * profile.age + 5
  const tdee = bmr * 1.2
  return Math.round(tdee - 500)
}

function calcStreak(dailyLogs) {
  let streak = 0
  let date = new Date()
  date.setDate(date.getDate() - 1)
  for (let i = 0; i < 365; i++) {
    const key = format(date, 'yyyy-MM-dd')
    const log = dailyLogs[key]
    if (log && (log.foodEntries?.length > 0 || Object.values(log.mealsEaten || {}).some(Boolean))) {
      streak++
      date.setDate(date.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

function reducer(state, action) {
  const todayKey = format(new Date(), 'yyyy-MM-dd')
  const todayLog = state.dailyLogs[todayKey] || { waterGlasses: 0, foodEntries: [], mealsEaten: {} }

  switch (action.type) {
    case 'LOG_FOOD': {
      const entry = { ...action.payload, id: Date.now(), time: new Date().toISOString() }
      const updated = { ...todayLog, foodEntries: [...(todayLog.foodEntries || []), entry] }
      return { ...state, dailyLogs: { ...state.dailyLogs, [todayKey]: updated } }
    }
    case 'DELETE_FOOD': {
      const updated = { ...todayLog, foodEntries: todayLog.foodEntries.filter(e => e.id !== action.payload) }
      return { ...state, dailyLogs: { ...state.dailyLogs, [todayKey]: updated } }
    }
    case 'TOGGLE_MEAL_EATEN': {
      const current = todayLog.mealsEaten?.[action.payload] || false
      const updated = { ...todayLog, mealsEaten: { ...todayLog.mealsEaten, [action.payload]: !current } }
      return { ...state, dailyLogs: { ...state.dailyLogs, [todayKey]: updated } }
    }
    case 'LOG_WATER': {
      const updated = { ...todayLog, waterGlasses: Math.min((todayLog.waterGlasses || 0) + 1, 12) }
      return { ...state, dailyLogs: { ...state.dailyLogs, [todayKey]: updated } }
    }
    case 'SET_WATER': {
      const updated = { ...todayLog, waterGlasses: action.payload }
      return { ...state, dailyLogs: { ...state.dailyLogs, [todayKey]: updated } }
    }
    case 'LOG_WEIGHT': {
      const existing = state.weightEntries.filter(e => e.date !== todayKey)
      return {
        ...state,
        weightEntries: [...existing, { date: todayKey, weight: action.payload }],
        profile: { ...state.profile, currentWeightKg: action.payload, dailyCalorieTarget: calcCalorieTarget({ ...state.profile, currentWeightKg: action.payload }) },
      }
    }
    case 'UPDATE_PROFILE': {
      const updated = { ...state.profile, ...action.payload }
      updated.dailyCalorieTarget = calcCalorieTarget(updated)
      return { ...state, profile: updated }
    }
    case 'SET_ACTIVE_DAY': {
      return { ...state, activeMealPlanDay: action.payload }
    }
    case 'SWAP_MEAL': {
      const key = `${action.payload.day}-${action.payload.slot}`
      const current = state.mealSwapIndices[key] || 0
      return { ...state, mealSwapIndices: { ...state.mealSwapIndices, [key]: current + 1 } }
    }
    case 'SET_STREAK': {
      return { ...state, currentStreak: action.payload }
    }
    case 'RESET_DATA': {
      return { ...initialState, profile: state.profile }
    }
    default:
      return state
  }
}

export const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [persistedState, setPersistedState] = useLocalStorage('fitethio-v1', initialState)
  const [state, dispatch] = useReducer(reducer, persistedState)

  useEffect(() => {
    setPersistedState(state)
  }, [state])

  useEffect(() => {
    const streak = calcStreak(state.dailyLogs)
    dispatch({ type: 'SET_STREAK', payload: streak })
  }, [])

  const todayKey = format(new Date(), 'yyyy-MM-dd')
  const todayLog = state.dailyLogs[todayKey] || { waterGlasses: 0, foodEntries: [], mealsEaten: {} }
  const todayCalories = (todayLog.foodEntries || []).reduce((s, e) => s + e.calories, 0)
  const calorieDeficit = state.profile.dailyCalorieTarget - todayCalories
  const bmi = +(state.profile.currentWeightKg / ((state.profile.heightCm / 100) ** 2)).toFixed(1)
  const totalLost = +(state.profile.currentWeightKg - (state.weightEntries[state.weightEntries.length - 1]?.weight ?? state.profile.currentWeightKg)).toFixed(1)
  const mealsCompletedToday = Object.values(todayLog.mealsEaten || {}).filter(Boolean).length

  const value = {
    state,
    dispatch,
    todayKey,
    todayLog,
    todayCalories,
    calorieDeficit,
    bmi,
    totalLost,
    mealsCompletedToday,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
