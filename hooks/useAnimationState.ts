import { useEffect, useState, useCallback } from 'react'
import type { AnimationSettings } from '@/lib/storage/provider'

type Mode = 'still' | 'lineWave' | 'blockSway' | 'colorCycle' | 'glitch' | 'frameCycle' | 'svgWave'
type Palette = 'yellow' | 'green' | 'blue' | 'rainbow'

const STORAGE_KEY = 'moonynaads-animation-state'

const DEFAULT_SETTINGS: AnimationSettings = {
  mode: 'lineWave',
  palette: 'yellow',
  speed: 1,
  amplitude: 8,
  gradient: false,
  targetChar: '',
  targetSet: '()/\\',
}

interface UseAnimationStateReturn extends AnimationSettings {
  mode: Mode
  palette: Palette
  setMode: (mode: Mode) => void
  setPalette: (palette: Palette) => void
  setSpeed: (speed: number) => void
  setAmplitude: (amplitude: number) => void
  setGradient: (gradient: boolean) => void
  setTargetChar: (char: string) => void
  setTargetSet: (set: string) => void
  resetSettings: () => void
  getSettings: () => AnimationSettings
}

export function useAnimationState(pantId?: string): UseAnimationStateReturn {
  const [mode, setMode] = useState<Mode>(DEFAULT_SETTINGS.mode)
  const [palette, setPalette] = useState<Palette>(DEFAULT_SETTINGS.palette)
  const [speed, setSpeed] = useState(DEFAULT_SETTINGS.speed)
  const [amplitude, setAmplitude] = useState(DEFAULT_SETTINGS.amplitude)
  const [gradient, setGradient] = useState(DEFAULT_SETTINGS.gradient)
  const [targetChar, setTargetChar] = useState(DEFAULT_SETTINGS.targetChar)
  const [targetSet, setTargetSet] = useState(DEFAULT_SETTINGS.targetSet)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const key = pantId ? `${STORAGE_KEY}-${pantId}` : STORAGE_KEY
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AnimationSettings>
        if (parsed.mode) setMode(parsed.mode as Mode)
        if (parsed.palette) setPalette(parsed.palette as Palette)
        if (typeof parsed.speed === 'number') setSpeed(parsed.speed)
        if (typeof parsed.amplitude === 'number') setAmplitude(parsed.amplitude)
        if (typeof parsed.gradient === 'boolean') setGradient(parsed.gradient)
        if (parsed.targetChar !== undefined) setTargetChar(parsed.targetChar)
        if (parsed.targetSet !== undefined) setTargetSet(parsed.targetSet)
      }
    } catch (e) {
      console.warn('Failed to load animation state:', e)
    }
    setIsHydrated(true)
  }, [pantId])

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (!isHydrated) return
    try {
      const key = pantId ? `${STORAGE_KEY}-${pantId}` : STORAGE_KEY
      const state: AnimationSettings = {
        mode,
        palette,
        speed,
        amplitude,
        gradient,
        targetChar,
        targetSet,
      }
      localStorage.setItem(key, JSON.stringify(state))
    } catch (e) {
      console.warn('Failed to save animation state:', e)
    }
  }, [mode, palette, speed, amplitude, gradient, targetChar, targetSet, isHydrated, pantId])

  const resetSettings = useCallback(() => {
    setMode(DEFAULT_SETTINGS.mode)
    setPalette(DEFAULT_SETTINGS.palette)
    setSpeed(DEFAULT_SETTINGS.speed)
    setAmplitude(DEFAULT_SETTINGS.amplitude)
    setGradient(DEFAULT_SETTINGS.gradient)
    setTargetChar(DEFAULT_SETTINGS.targetChar)
    setTargetSet(DEFAULT_SETTINGS.targetSet)
  }, [])

  const getSettings = useCallback((): AnimationSettings => ({
    mode,
    palette,
    speed,
    amplitude,
    gradient,
    targetChar,
    targetSet,
  }), [mode, palette, speed, amplitude, gradient, targetChar, targetSet])

  return {
    mode,
    palette,
    speed,
    amplitude,
    gradient,
    targetChar,
    targetSet,
    setMode,
    setPalette,
    setSpeed,
    setAmplitude,
    setGradient,
    setTargetChar,
    setTargetSet,
    resetSettings,
    getSettings,
  }
}
