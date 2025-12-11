/**
 * Color-aware ASCII art generation with shadow and tone mapping
 * Integrates color rendering with structural ASCII modifications
 */

export interface ColorAwareAsciiParams {
  baseArt: string
  colorMode: 'brightness' | 'shadow' | 'tone-map' | 'contour' | 'none'
  colorSeed?: string
  intensity: number // 0-100, how strongly color affects ASCII
  shadowDepth: number // 0-100, darkness of shadows
}

export interface ColorChannel {
  r: number
  g: number
  b: number
}

/**
 * ASCII character ramps ordered from lightest to darkest
 */
const ASCII_RAMPS = {
  // Minimal impact - just replaces with slightly different variants
  subtle: [' ', '.', ',', '`', "'", '^', '_', '-', '~', ':', '|', '!'],
  
  // Standard ramp - moderate contrast
  standard: [' ', '.', ',', ':', ';', 'c', 'i', 'l', '1', '!', 'L', 'I', 'o', 'O', '0', '@', '#'],
  
  // Dramatic ramp - high contrast shadow mapping
  dramatic: [' ', '.', '`', "'", '^', '-', '_', '~', ':', '!', '|', '/', '\\', 'c', 'C', 'x', 'X', 'S', '@', '#', '%', '&'],
  
  // Lunar theme - moon/orbital specific
  lunar: [' ', '.', 'o', 'O', '0', 'Q', '@', '#'],
  
  // Organic/shadow focused
  shadow: [' ', "'", '`', '.', ':', 'i', '!', '|', 'l', '/', '\\', 'x', 'c', 'o', 'O', '%', '@', '#'],
}

type RampType = keyof typeof ASCII_RAMPS

/**
 * Detects which ASCII ramp to use based on the content
 */
function detectApplicableRamp(baseArt: string): RampType {
  const lines = baseArt.split('\n')
  let hasCircles = false
  let hasLines = false
  let hasAngular = false
  
  for (const line of lines) {
    if (/[oO0]/.test(line)) hasCircles = true
    if (/[-~_|/\\]/.test(line)) hasLines = true
    if (/[<>\/\\xX]/.test(line)) hasAngular = true
  }
  
  if (hasCircles && !hasAngular) return 'lunar'
  if (hasAngular || hasLines) return 'standard'
  return 'standard'
}

/**
 * Calculates line brightness/density for tone mapping
 */
function calculateLineBrightness(line: string): number {
  if (line.length === 0) return 0
  const nonSpace = line.split('').filter(c => c !== ' ').length
  return (nonSpace / line.length) * 100
}

/**
 * Seeded random for deterministic color generation
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
 * Converts a character to a brightness value (0-100)
 * More "solid" characters = darker = higher brightness
 */
function getCharBrightness(char: string): number {
  const brightnessMap: Record<string, number> = {
    ' ': 0,
    '.': 5,
    ',': 5,
    '`': 5,
    "'": 5,
    '^': 10,
    '_': 10,
    '-': 15,
    '~': 20,
    ':': 25,
    ';': 25,
    '!': 30,
    '|': 35,
    '/': 40,
    '\\': 40,
    'c': 45,
    'l': 45,
    '1': 45,
    'i': 45,
    'o': 60,
    'O': 70,
    '0': 75,
    'C': 50,
    'L': 50,
    'I': 50,
    'x': 55,
    'X': 65,
    'S': 65,
    'Q': 80,
    '@': 90,
    '#': 95,
    '%': 85,
    '&': 88,
  }
  
  return brightnessMap[char] ?? 50 // Default to middle brightness
}

/**
 * Main color-aware ASCII generation function
 */
export function generateColorAwareAscii(params: ColorAwareAsciiParams): string {
  const { baseArt, colorMode, colorSeed = '', intensity, shadowDepth } = params
  
  if (colorMode === 'none') return baseArt
  
  const lines = baseArt.split('\n')
  const rampType = detectApplicableRamp(baseArt)
  const ramp = ASCII_RAMPS[rampType]
  
  const result = lines.map((line, lineIndex) => {
    return line.split('').map((char, charIndex) => {
      // Skip spaces
      if (char === ' ') return char
      
      // Get original character's brightness as baseline
      const originalBrightness = getCharBrightness(char)
      
      let targetBrightness = originalBrightness
      
      if (colorMode === 'brightness') {
        targetBrightness = applyBrightnessMode(
          line,
          lineIndex,
          charIndex,
          originalBrightness,
          intensity
        )
      } else if (colorMode === 'shadow') {
        targetBrightness = applyShadowMode(
          line,
          lineIndex,
          charIndex,
          originalBrightness,
          shadowDepth,
          intensity
        )
      } else if (colorMode === 'tone-map') {
        targetBrightness = applyToneMapMode(
          line,
          lineIndex,
          originalBrightness,
          intensity,
          colorSeed
        )
      } else if (colorMode === 'contour') {
        targetBrightness = applyContourMode(
          lines,
          lineIndex,
          charIndex,
          originalBrightness,
          intensity,
          colorSeed
        )
      }
      
      // Find closest ramp character to target brightness
      const rampIndex = Math.round((targetBrightness / 100) * (ramp.length - 1))
      const clampedIndex = Math.max(0, Math.min(ramp.length - 1, rampIndex))
      
      return ramp[clampedIndex]
    }).join('')
  }).join('\n')
  
  return result
}

/**
 * Brightness mode: varies characters based on overall line brightness
 */
function applyBrightnessMode(
  line: string,
  lineIndex: number,
  charIndex: number,
  originalBrightness: number,
  intensity: number
): number {
  const lineBrightness = calculateLineBrightness(line)
  const variation = (lineBrightness / 100) * intensity
  return Math.min(100, originalBrightness + (variation * 0.5))
}

/**
 * Shadow mode: darkens characters and their surroundings to create depth
 */
function applyShadowMode(
  line: string,
  lineIndex: number,
  charIndex: number,
  originalBrightness: number,
  shadowDepth: number,
  intensity: number
): number {
  // Check if surrounded by spaces (edge detection)
  const leftIsSpace = charIndex === 0 || line[charIndex - 1] === ' '
  const rightIsSpace = charIndex === line.length - 1 || line[charIndex + 1] === ' '
  const isEdge = leftIsSpace || rightIsSpace
  
  if (isEdge) {
    // Edges get darkened for shadow effect
    const shadowReduction = (shadowDepth / 100) * intensity
    return Math.max(0, originalBrightness - shadowReduction * 30)
  }
  
  // Interior characters stay relatively unchanged
  return originalBrightness
}

/**
 * Tone-map mode: maps line density to brightness ramp
 */
function applyToneMapMode(
  line: string,
  lineIndex: number,
  originalBrightness: number,
  intensity: number,
  seed: string
): number {
  const lineBrightness = calculateLineBrightness(line)
  const seedVariation = seed ? seededRandom(seed, lineIndex) * 20 - 10 : 0
  
  // Dense lines get darker characters
  const mapped = (lineBrightness / 100) * 100
  const adjustment = (mapped - 50) * (intensity / 100) * 0.4
  
  return Math.max(0, Math.min(100, 50 + adjustment + seedVariation))
}

/**
 * Contour mode: creates visual contours by analyzing density changes
 */
function applyContourMode(
  lines: string[],
  lineIndex: number,
  charIndex: number,
  originalBrightness: number,
  intensity: number,
  seed: string
): number {
  // Check density of current line and neighbors
  const currentDensity = calculateLineBrightness(lines[lineIndex])
  const prevDensity = lineIndex > 0 ? calculateLineBrightness(lines[lineIndex - 1]) : currentDensity
  const nextDensity = lineIndex < lines.length - 1 ? calculateLineBrightness(lines[lineIndex + 1]) : currentDensity
  
  // Detect edges (density change > 20%)
  const densityChange = Math.abs(currentDensity - prevDensity) + Math.abs(currentDensity - nextDensity)
  
  if (densityChange > 20) {
    // Edge detected - increase brightness for visibility
    const edgeBoost = (densityChange / 40) * intensity
    return Math.min(100, originalBrightness + edgeBoost * 0.5)
  }
  
  // Smooth areas use tone mapping
  const baseTarget = (currentDensity / 100) * 100
  return Math.max(0, Math.min(100, baseTarget))
}

/**
 * Integration function for existing emoji substitution workflow
 */
export function integrateColorAwareAscii(
  baseArt: string,
  colorMode: 'brightness' | 'shadow' | 'tone-map' | 'contour' | 'none' = 'none',
  intensity: number = 50,
  shadowDepth: number = 50,
  seed?: string
): string {
  return generateColorAwareAscii({
    baseArt,
    colorMode,
    intensity,
    shadowDepth,
    colorSeed: seed
  })
}

/**
 * Helper to analyze ASCII art for color suitability
 */
export function analyzeAsciiForColor(art: string): {
  hasMoonElements: boolean
  hasAngularElements: boolean
  averageDensity: number
  maxDensity: number
  isCandidate: boolean
} {
  const lines = art.split('\n')
  const densities = lines.map(calculateLineBrightness)
  const avgDensity = densities.reduce((a, b) => a + b, 0) / densities.length
  const maxDensity = Math.max(...densities)
  
  const hasMoonElements = /[oO0]/.test(art)
  const hasAngularElements = /[<>\/\\xX]/.test(art)
  
  // Only suitable for color if there's decent variation in density
  const isCandidate = maxDensity - Math.min(...densities) > 20
  
  return {
    hasMoonElements,
    hasAngularElements,
    averageDensity: avgDensity,
    maxDensity,
    isCandidate
  }
}
