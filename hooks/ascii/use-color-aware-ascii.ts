import { useMemo, useState, useCallback } from 'react'
import {
  generateColorAwareAscii,
  analyzeAsciiForColor,
  type ColorAwareAsciiParams,
} from '@/lib/color-aware-ascii-generator'

export type ColorAwareMode = 'brightness' | 'shadow' | 'tone-map' | 'contour' | 'none'

export interface UseColorAwareAsciiOptions {
  baseArt: string
  mode: ColorAwareMode
  intensity?: number
  shadowDepth?: number
  seed?: string
}

export function useColorAwareAscii(options: UseColorAwareAsciiOptions) {
  const {
    baseArt,
    mode = 'none',
    intensity = 50,
    shadowDepth = 50,
    seed = '',
  } = options

  const [localIntensity, setLocalIntensity] = useState(intensity)
  const [localShadowDepth, setLocalShadowDepth] = useState(shadowDepth)
  const [localSeed, setLocalSeed] = useState(seed)

  const analysis = useMemo(() => {
    return analyzeAsciiForColor(baseArt)
  }, [baseArt])

  const coloredArt = useMemo(() => {
    if (mode === 'none') return baseArt

    return generateColorAwareAscii({
      baseArt,
      colorMode: mode,
      intensity: localIntensity,
      shadowDepth: localShadowDepth,
      colorSeed: localSeed,
    })
  }, [baseArt, mode, localIntensity, localShadowDepth, localSeed])

  const randomizeSeed = useCallback(() => {
    setLocalSeed(`seed-${Math.random().toString(36).slice(2, 9)}`)
  }, [])

  const resetToDefaults = useCallback(() => {
    setLocalIntensity(50)
    setLocalShadowDepth(50)
    setLocalSeed('')
  }, [])

  return {
    // Output
    coloredArt,
    analysis,

    // State
    intensity: localIntensity,
    shadowDepth: localShadowDepth,
    seed: localSeed,

    // Controls
    setIntensity: setLocalIntensity,
    setShadowDepth: setLocalShadowDepth,
    setSeed: setLocalSeed,
    randomizeSeed,
    resetToDefaults,

    // Metadata
    isDarkMode: mode === 'shadow',
    isToneMap: mode === 'tone-map',
    isContour: mode === 'contour',
    canApplyColor: analysis.isCandidate,
  }
}

/**
 * Helper hook to get description for a color mode
 */
export function getColorAwareModeLabel(mode: ColorAwareMode): string {
  const labels: Record<ColorAwareMode, string> = {
    none: 'No Color Effect',
    brightness: 'Brightness Mapping',
    shadow: 'Shadow Depth',
    'tone-map': 'Tone Mapping',
    contour: 'Contour Detection',
  }
  return labels[mode] || 'Unknown'
}

export function getColorAwareModeDescription(mode: ColorAwareMode): string {
  const descriptions: Record<ColorAwareMode, string> = {
    none: 'Leaves ASCII art unchanged',
    brightness: 'Varies character density based on line brightness',
    shadow: 'Creates depth by darkening edges and surrounded characters',
    'tone-map': 'Maps line density to ASCII brightness ramp',
    contour: 'Highlights density changes to reveal contours',
  }
  return descriptions[mode] || 'Unknown mode'
}
