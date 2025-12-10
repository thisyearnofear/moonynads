import { useMemo } from 'react'

export type ColorRenderMode = 'none' | 'monochrome' | 'negative-space' | 'density-map'
export type ColorVariation = 'deterministic' | 'seedable'

export interface ColorRegion {
  startRow: number
  endRow: number
  color: 'black' | 'white'
}

export interface ColorMetadata {
  mode: ColorRenderMode
  regions: ColorRegion[]
  densityMap?: Map<number, number> // row -> density percentage
}

/**
 * Seeded random number generator for reproducible color schemes
 */
function seededRandom(seed: string, index: number): number {
  const hash = hashCode(seed + index.toString())
  return Math.abs(hash) / 2147483647
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash
}

/**
 * Palette presets for seedable coloring
 */
const colorPalettes = [
  { black: '#000000', white: '#ffffff', accent: '#808080' }, // Standard
  { black: '#1a1a1a', white: '#e0e0e0', accent: '#707070' }, // Warm
  { black: '#0a0a14', white: '#f0f0ff', accent: '#6060a0' }, // Cool
  { black: '#14140a', white: '#fffaf0', accent: '#a0a060' }, // Sepia
  { black: '#0a140a', white: '#f0fff0', accent: '#60a060' }, // Nature
]

/**
 * Analyzes ASCII art to determine color regions and negative space
 */
export function useColorRendering(
  text: string, 
  mode: ColorRenderMode = 'none',
  variation: ColorVariation = 'deterministic',
  seed: string = ''
) {
  const lines = useMemo(() => text.split('\n'), [text])

  // Calculate density (non-space character ratio) per line
  const lineDensities = useMemo(() => {
    return lines.map((line) => {
      const nonSpace = line.split('').filter((c) => c !== ' ').length
      return nonSpace > 0 ? (nonSpace / line.length) * 100 : 0
    })
  }, [lines])

  // Get density threshold based on variation mode
  const densityThreshold = useMemo(() => {
    if (variation === 'seedable' && seed) {
      // Vary threshold between 35-45% based on seed
      const baseThreshold = 40
      const seedRand = seededRandom(seed, 100)
      return baseThreshold + (seedRand * 10 - 5) // ±5 from 40
    }
    return 40
  }, [variation, seed])

  // Get color palette based on variation mode
  const colorPalette = useMemo(() => {
    if (variation === 'seedable' && seed) {
      const paletteIndex = Math.floor(seededRandom(seed, 200) * colorPalettes.length)
      return colorPalettes[paletteIndex]
    }
    return colorPalettes[0] // Standard palette
  }, [variation, seed])

  // Detect regions with sharp density changes (contours)
  const detectContours = useMemo(() => {
    const contours: ColorRegion[] = []
    let currentColor: 'black' | 'white' = 'white'
    let regionStart = 0

    for (let i = 0; i < lineDensities.length; i++) {
      const density = lineDensities[i]
      const isHigh = density > densityThreshold // Dynamic threshold
      const shouldBeBlack = isHigh

      if (shouldBeBlack !== (currentColor === 'black') && i > 0) {
        // Color change detected
        contours.push({
          startRow: regionStart,
          endRow: i - 1,
          color: currentColor,
        })
        currentColor = shouldBeBlack ? 'black' : 'white'
        regionStart = i
      }
    }

    // Add final region
    if (regionStart < lineDensities.length) {
      contours.push({
        startRow: regionStart,
        endRow: lineDensities.length - 1,
        color: currentColor,
      })
    }

    return contours
  }, [lineDensities, densityThreshold])

  // Simplify regions to reduce fragmentation
  const simplifyedRegions = useMemo(() => {
    if (detectContours.length === 0) return []

    const simplified: ColorRegion[] = [detectContours[0]]

    for (let i = 1; i < detectContours.length; i++) {
      const current = detectContours[i]
      const last = simplified[simplified.length - 1]

      // Merge if region is too small (< 3 lines) or same color
      if (current.color === last.color || current.startRow - last.endRow <= 2) {
        last.endRow = current.endRow
      } else {
        simplified.push(current)
      }
    }

    return simplified
  }, [detectContours])

  // Apply color to individual characters based on mode
  const getCharColor = (lineIndex: number, charIndex: number, char: string): string | null => {
    if (mode === 'none') return null
    if (char === ' ') return null // Never color spaces

    if (mode === 'monochrome') {
      // Find region for this line
      const region = simplifyedRegions.find(
        (r) => lineIndex >= r.startRow && lineIndex <= r.endRow
      )
      return region?.color === 'black' ? colorPalette.black : colorPalette.white
    }

    if (mode === 'negative-space') {
      // Invert: color empty spaces based on surrounding content
      const density = lineDensities[lineIndex]
      const nearContentThreshold = variation === 'seedable' && seed ? 15 + seededRandom(seed, 300) * 10 : 20
      const isNearContent = density > nearContentThreshold
      return isNearContent ? colorPalette.black : colorPalette.white
    }

    if (mode === 'density-map') {
      // Gradient based on character density
      const density = lineDensities[lineIndex]
      // Map density 0-100 to grayscale using palette colors
      const blackRGB = parseInt(colorPalette.black.slice(1), 16)
      const whiteRGB = parseInt(colorPalette.white.slice(1), 16)
      const blackR = (blackRGB >> 16) & 255
      const blackG = (blackRGB >> 8) & 255
      const blackB = blackRGB & 255
      const whiteR = (whiteRGB >> 16) & 255
      const whiteG = (whiteRGB >> 8) & 255
      const whiteB = whiteRGB & 255
      const t = density / 100
      const r = Math.round(blackR + (whiteR - blackR) * t)
      const g = Math.round(blackG + (whiteG - blackG) * t)
      const b = Math.round(blackB + (whiteB - blackB) * t)
      return `rgb(${r}, ${g}, ${b})`
    }

    return null
  }

  // Get the background color for rendering (inverse of content)
  const getLineBackgroundColor = (lineIndex: number): string | null => {
    if (mode === 'none' || mode === 'density-map') return null

    if (mode === 'negative-space') {
      // Fill the void around the shape
      const region = simplifyedRegions.find(
        (r) => lineIndex >= r.startRow && lineIndex <= r.endRow
      )
      const contentColor = region?.color === 'black' ? colorPalette.black : colorPalette.white
      // Inverse for negative space
      return contentColor === colorPalette.black ? colorPalette.white : colorPalette.black
    }

    if (mode === 'monochrome') {
      const region = simplifyedRegions.find(
        (r) => lineIndex >= r.startRow && lineIndex <= r.endRow
      )
      return region?.color === 'black' ? colorPalette.black : colorPalette.white
    }

    return null
  }

  const metadata: ColorMetadata = {
    mode,
    regions: simplifyedRegions,
    densityMap: new Map(lineDensities.map((d, i) => [i, d])),
  }

  return {
    mode,
    lines,
    lineDensities,
    regions: simplifyedRegions,
    getCharColor,
    getLineBackgroundColor,
    metadata,
    variation,
    seed,
    colorPalette,
    densityThreshold,
  }
}

/**
 * Convert color mode to human-readable label
 */
export function getColorModeLabel(mode: ColorRenderMode): string {
  const labels: Record<ColorRenderMode, string> = {
    none: 'no color',
    monochrome: 'monochrome',
    'negative-space': 'negative space',
    'density-map': 'density map',
  }
  return labels[mode] || 'unknown'
}
