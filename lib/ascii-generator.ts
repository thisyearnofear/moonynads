export interface AsciiGenerationParams {
  seed: string
  baseDesign?: string // ID from PANTS catalog
  variation?: 'subtle' | 'moderate' | 'dramatic'
  complexity?: number // 1-10 scale for additional elements
  preserveTheme?: boolean // Stay true to original theme
}

export interface GeneratedAscii {
  art: string
  metadata: {
    seed: string
    baseDesign: string
    variation: string
    complexity: number
    changes: number
    themePreservation: number
  }
}

interface PantTemplate {
  id: string
  name: string
  rarity: string
  description: string
  baseArt: string
  frames?: string[]
  themes: string[]
  allowedChars: string[]
  forbiddenChars: string[]
}

/**
 * Load existing pant designs as templates for generative variations
 * Client-safe version using fetch instead of fs
 */
async function loadPantTemplate(pantId: string): Promise<PantTemplate | null> {
  try {
    let baseArt: string
    
    // Check if we're in a Node.js environment (test environment)
    if (typeof window === 'undefined' && typeof process !== 'undefined') {
      // Node.js environment - read files directly
      const fs = await import('fs').then(m => m.promises).catch(() => null)
      const path = await import('path').then(m => m.default).catch(() => null)
      
      if (fs && path) {
        const filePath = path.join(process.cwd(), 'public', 'pants', `${pantId}.txt`)
        try {
          baseArt = await fs.readFile(filePath, 'utf-8')
        } catch (error) {
          return null
        }
      } else {
        return null
      }
    } else {
      // Browser environment - use fetch
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                     (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
      
      const baseArtResponse = await fetch(`${baseUrl}/pants/${pantId}.txt`)
      if (!baseArtResponse.ok) {
        return null
      }
      baseArt = await baseArtResponse.text()
    }
    
    // Load frame variations if they exist
    const frames: string[] = []
    for (let i = 1; i <= 4; i++) {
      try {
        let frameContent: string
        
        if (typeof window === 'undefined' && typeof process !== 'undefined') {
          // Node.js environment
          const fs = await import('fs').then(m => m.promises).catch(() => null)
          const path = await import('path').then(m => m.default).catch(() => null)
          
          if (fs && path) {
            const framePath = path.join(process.cwd(), 'public', 'pants', `${pantId}-frame-${i}.txt`)
            try {
              frameContent = await fs.readFile(framePath, 'utf-8')
              frames.push(frameContent)
            } catch (error) {
              // Frame doesn't exist, continue
            }
          }
        } else {
          // Browser environment
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                         (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
          const frameResponse = await fetch(`${baseUrl}/pants/${pantId}-frame-${i}.txt`)
          if (frameResponse.ok) {
            frames.push(await frameResponse.text())
          }
        }
      } catch (error) {
        // Frame doesn't exist, continue
      }
    }
    
    // Define theme characteristics based on pant ID
    const themes = getPantThemes(pantId)
    const allowedChars = getAllowedCharsForTheme(pantId)
    const forbiddenChars = getForbiddenCharsForTheme(pantId)
    
    return {
      id: pantId,
      name: getPantName(pantId),
      rarity: getPantRarity(pantId),
      description: getPantDescription(pantId),
      baseArt,
      frames: frames.length > 0 ? frames : undefined,
      themes,
      allowedChars,
      forbiddenChars
    }
  } catch (error) {
    console.error(`Failed to load pant template ${pantId}:`, error)
    return null
  }
}

function getPantThemes(pantId: string): string[] {
  const themeMap: Record<string, string[]> = {
    'moon': ['lunar', 'celestial', 'circular', 'craters'],
    'moon2': ['lunar', 'detailed', 'texture', 'craters'],
    'moon3': ['lunar', 'minimalist', 'geometric', 'clean'],
    'heart': ['romantic', 'cardiac', 'curved', 'emotional'],
    'lady': ['mystical', 'goddess', 'flowing', 'ethereal'],
    'chudnovsky': ['mathematical', 'complex', 'fractal', 'precise'],
    'headupbutt': ['playful', 'cheeky', 'humorous', 'moon'],
    'hips': ['curvaceous', 'lunar', 'landscape', 'flowing'],
    'l': ['abstract', 'geometric', 'angular', 'lunar'],
    'm': ['dual', 'mountainous', 'letterform', 'lunar'],
    'multi': ['constellation', 'multiple', 'clustered', 'lunar'],
    's': ['crescent', 'curved', 'letterform', 'lunar'],
    'xl': ['large', 'dominant', 'imposing', 'lunar']
  }
  return themeMap[pantId] || ['abstract', 'geometric']
}

function getAllowedCharsForTheme(pantId: string): string[] {
  const charMap: Record<string, string[]> = {
    'moon': ['o', 'O', '0', '(', ')', '{', '}', '[', ']', '|', '/', '\\', '~', '-'],
    'moon2': ['o', 'O', '0', '(', ')', '{', '}', '[', ']', '|', '/', '\\', '~', '-', '.', '*'],
    'moon3': ['o', 'O', '(', ')', '{', '}', '[', ']', '|', '/'],
    'heart': ['\\', '/', '<', '>', '(', ')', '{', '}', '|', '.', '`', '\''],
    'lady': ['(', ')', '{', '}', '[', ']', '|', '/', '\\', '~', '-', '_', '\\'],
    'chudnovsky': ['.', '|', '/', '\\', 'Y', 'j', 'l', '*', ':', '`', '\''],
    'headupbutt': ['o', 'O', '(', ')', '{', '}', '[', ']', '|', '/', '\\'],
    'hips': ['(', ')', '{', '}', '[', ']', '|', '/', '\\', '~', '-'],
    'l': ['|', '_', '/', '\\', '(', ')', '{', '}'],
    'm': ['|', '/', '\\', '(', ')', '{', '}', '[', ']', 'v'],
    'multi': ['o', 'O', '0', '(', ')', '{', '}', '[', ']', '.', '*'],
    's': ['~', ')', '(', '{', '}', '[', ']', 's', 'S'],
    'xl': ['O', '0', '(', ')', '{', '}', '[', ']', '|', '/', '\\']
  }
  return charMap[pantId] || ['|', '/', '\\', '(', ')', '{', '}', '[', ']', '-', '~']
}

function getForbiddenCharsForTheme(pantId: string): string[] {
  // Characters that would break the theme
  const forbiddenMap: Record<string, string[]> = {
    'moon': ['#', '@', '$', '%', '&', '+', '='],
    'heart': ['#', '@', '$', '%', '&', '+', '=', '0'],
    'lady': ['#', '@', '$', '%', '&', '+', '='],
    'chudnovsky': ['#', '@', '$', '%', '&', '+', '=']
  }
  return forbiddenMap[pantId] || []
}

function getPantName(pantId: string): string {
  const nameMap: Record<string, string> = {
    'moon': 'Moon #1',
    'moon2': 'Moon #2',
    'moon3': 'Moon #3',
    'heart': 'Lunar Heart',
    'lady': 'Moon Lady',
    'chudnovsky': 'Chudnovsky Moon',
    'headupbutt': 'Lunar Butt',
    'hips': 'Moon Hips',
    'l': 'Lunar L',
    'm': 'Lunar M',
    'multi': 'Multi-Moon',
    's': 'Lunar S',
    'xl': 'XL Moon'
  }
  return nameMap[pantId] || 'Unknown Pant'
}

function getPantRarity(pantId: string): string {
  const rarityMap: Record<string, string> = {
    'moon': 'common',
    'moon2': 'uncommon',
    'moon3': 'common',
    'heart': 'rare',
    'lady': 'epic',
    'chudnovsky': 'legendary',
    'headupbutt': 'uncommon',
    'hips': 'rare',
    'l': 'common',
    'm': 'common',
    'multi': 'uncommon',
    's': 'rare',
    'xl': 'epic'
  }
  return rarityMap[pantId] || 'common'
}

function getPantDescription(pantId: string): string {
  const descMap: Record<string, string> = {
    'moon': 'The original moonynad - a classic lunar ASCII art piece',
    'moon2': 'A more detailed lunar landscape with craters and texture',
    'moon3': 'Minimalist moon design with clean geometric lines',
    'heart': 'A heart-shaped moon - rare romantic edition',
    'lady': 'Mystical lunar goddess with flowing robes',
    'chudnovsky': 'Complex mathematical moon pattern',
    'headupbutt': 'A cheeky moon with a playful twist',
    'hips': 'Curvaceous lunar landscape',
    'l': 'Abstract moon in the shape of letter L',
    'm': 'Dual moon formation resembling letter M',
    'multi': 'A constellation of multiple moons',
    's': 'Crescent moon forming an S shape',
    'xl': 'Extra large lunar display'
  }
  return descMap[pantId] || 'A unique ASCII art piece'
}

/**
 * Deterministic ASCII art generator that builds upon existing pant designs
 * Ensures same seed always produces same output (critical for NFT reproducibility)
 */
export class AsciiGenerator {
  private seed: string
  private baseDesign: string
  private variation: string
  private complexity: number
  private preserveTheme: boolean

  constructor(params: AsciiGenerationParams) {
    this.seed = params.seed
    this.baseDesign = params.baseDesign || 'moon'
    this.variation = params.variation || 'subtle'
    this.complexity = params.complexity || 3
    this.preserveTheme = params.preserveTheme !== false
  }

  /**
   * Deterministic pseudo-random number generator based on seed
   */
  private seededRandom(index: number): number {
    const hash = this.hashCode(this.seed + index.toString())
    return Math.abs(hash) / 2147483647
  }

  private hashCode(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash
  }

  /**
   * Generate ASCII art variation based on existing pant design
   */
  async generate(): Promise<GeneratedAscii> {
    const template = await loadPantTemplate(this.baseDesign)
    if (!template) {
      throw new Error(`Pant template '${this.baseDesign}' not found`)
    }

    // Parse base art into grid
    const baseGrid = this.parseAsciiToGrid(template.baseArt)
    const modifiedGrid = this.createVariation(baseGrid, template)
    
    // Convert back to ASCII
    const art = this.gridToAscii(modifiedGrid)
    
    // Calculate theme preservation score
    const preservationScore = this.calculateThemePreservation(baseGrid, modifiedGrid, template)
    
    return {
      art,
      metadata: {
        seed: this.seed,
        baseDesign: this.baseDesign,
        variation: this.variation,
        complexity: this.complexity,
        changes: this.countChanges(baseGrid, modifiedGrid),
        themePreservation: preservationScore
      }
    }
  }

  private parseAsciiToGrid(ascii: string): string[][] {
    return ascii.split('\n').map(line => line.split(''))
  }

  private gridToAscii(grid: string[][]): string {
    return grid.map(row => row.join('')).join('\n')
  }

  private createVariation(baseGrid: string[][], template: PantTemplate): string[][] {
    const grid = baseGrid.map(row => [...row]) // Deep copy
    
    // Determine number of changes based on variation level
    const changeCounts = {
      subtle: Math.floor(this.complexity * 0.3) + 1,
      moderate: Math.floor(this.complexity * 0.8) + 2,
      dramatic: Math.floor(this.complexity * 1.2) + 3
    }
    
    const numChanges = changeCounts[this.variation as keyof typeof changeCounts]
    let changesMade = 0
    
    // Apply different types of variations based on variation level
    let variationTypes: Array<() => boolean>
    
    if (this.variation === 'subtle') {
      // Subtle: mostly preservation with minor tweaks
      variationTypes = [
        () => this.applyCharacterSubstitution(grid, template),
        () => this.applyDetailAddition(grid, template),
        () => this.applyTextureVariation(grid, template)
      ]
    } else if (this.variation === 'moderate') {
      // Moderate: balanced changes
      variationTypes = [
        () => this.applyCharacterSubstitution(grid, template),
        () => this.applyDetailAddition(grid, template),
        () => this.applyLineModification(grid, template),
        () => this.applyTextureVariation(grid, template)
      ]
    } else {
      // Dramatic: focus on adding elements, not destroying structure
      variationTypes = [
        () => this.applyDetailAddition(grid, template),
        () => this.applyTextureVariation(grid, template),
        () => this.applyLineModification(grid, template),
        () => this.applyCharacterSubstitution(grid, template)
      ]
    }
    
    // Apply variations based on complexity and variation level
    let attempts = 0
    const maxAttempts = numChanges * 10 // Prevent infinite loops
    
    while (changesMade < numChanges && attempts < maxAttempts) {
      attempts++
      const variationIndex = Math.floor(this.seededRandom(changesMade * 1000 + attempts) * variationTypes.length)
      const success = variationTypes[variationIndex]()
      if (success) changesMade++
    }
    
    return grid
  }

  private applyPositionShift(grid: string[][], template: PantTemplate): boolean {
    // Only apply position shifts for subtle variations
    if (this.variation !== 'subtle') return false
    
    // Subtle position shifts (1 character max)
    const shiftX = Math.floor(this.seededRandom(100) * 2) // 0 or 1
    const shiftY = Math.floor(this.seededRandom(200) * 2) // 0 or 1
    
    if (shiftX === 0 && shiftY === 0) return false
    
    // Instead of shifting the entire grid, shift individual elements
    const elementsToShift: Array<{x: number, y: number, char: string}> = []
    
    // Find connected components (elements that can be shifted independently)
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] !== ' ' && Math.random() < 0.3) { // 30% chance to shift each element
          elementsToShift.push({x, y, char: grid[y][x]})
        }
      }
    }
    
    if (elementsToShift.length === 0) return false
    
    // Shift individual elements
    elementsToShift.forEach(({x, y}) => {
      const newX = Math.min(grid[y].length - 1, Math.max(0, x + shiftX))
      const newY = Math.min(grid.length - 1, Math.max(0, y + shiftY))
      
      if (grid[newY] && grid[newY][newX] === ' ') {
        grid[newY][newX] = grid[y][x]
        grid[y][x] = ' '
      }
    })
    
    return true
  }

  private applyCharacterSubstitution(grid: string[][], template: PantTemplate): boolean {
    // Find substitutable characters
    const substitutable: Array<{x: number, y: number, char: string}> = []
    
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const char = grid[y][x]
        if (char !== ' ' && !template.forbiddenChars.includes(char)) {
          substitutable.push({x, y, char})
        }
      }
    }
    
    if (substitutable.length === 0) return false
    
    // Pick random position to substitute
    const target = substitutable[Math.floor(this.seededRandom(300) * substitutable.length)]
    
    // Find compatible substitution
    const allowedChars = template.allowedChars.filter(c => c !== target.char)
    if (allowedChars.length === 0) return false
    
    const newChar = allowedChars[Math.floor(this.seededRandom(400) * allowedChars.length)]
    grid[target.y][target.x] = newChar
    
    return true
  }

  private applyDetailAddition(grid: string[][], template: PantTemplate): boolean {
    // Add small details that fit the theme
    const emptySpaces: Array<{x: number, y: number}> = []
    
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === ' ') {
          emptySpaces.push({x, y})
        }
      }
    }
    
    if (emptySpaces.length === 0) return false
    
    // Pick random empty space
    const target = emptySpaces[Math.floor(this.seededRandom(500) * emptySpaces.length)]
    
    // Add appropriate detail character
    const detailChars = template.allowedChars.filter(c => 
      ['.', '*', '~', '-', '\'', '`'].includes(c)
    )
    
    if (detailChars.length === 0) return false
    
    const detailChar = detailChars[Math.floor(this.seededRandom(600) * detailChars.length)]
    grid[target.y][target.x] = detailChar
    
    return true
  }

  private applyLineModification(grid: string[][], template: PantTemplate): boolean {
    // Find existing lines to modify
    const lines: Array<Array<{x: number, y: number, char: string}>> = []
    let currentLine: Array<{x: number, y: number, char: string}> = []
    
    // Scan for horizontal lines
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const char = grid[y][x]
        if (['-', '~', '_'].includes(char)) {
          currentLine.push({x, y, char})
        } else if (currentLine.length > 2) {
          lines.push([...currentLine])
          currentLine = []
        }
      }
      if (currentLine.length > 2) {
        lines.push([...currentLine])
      }
      currentLine = []
    }
    
    if (lines.length === 0) return false
    
    // Modify a random line
    const targetLine = lines[Math.floor(this.seededRandom(700) * lines.length)]
    const modification = Math.floor(this.seededRandom(800) * 3)
    
    if (modification === 0) {
      // Extend line
      const lastPoint = targetLine[targetLine.length - 1]
      if (lastPoint.x + 1 < grid[lastPoint.y].length) {
        const extensionChar = template.allowedChars.find(c => ['-', '~'].includes(c)) || '-'
        grid[lastPoint.y][lastPoint.x + 1] = extensionChar
      }
    } else if (modification === 1) {
      // Shorten line
      if (targetLine.length > 3) {
        const removePoint = targetLine[Math.floor(this.seededRandom(900) * targetLine.length)]
        grid[removePoint.y][removePoint.x] = ' '
      }
    } else {
      // Change line character
      const changePoint = targetLine[Math.floor(this.seededRandom(1000) * targetLine.length)]
      const altChars = template.allowedChars.filter(c => 
        ['-', '~', '_'].includes(c) && c !== changePoint.char
      )
      if (altChars.length > 0) {
        grid[changePoint.y][changePoint.x] = altChars[0]
      }
    }
    
    return true
  }

  private applyTextureVariation(grid: string[][], template: PantTemplate): boolean {
    // Add texture variations that fit the theme
    const theme = template.themes[0]
    
    if (theme === 'lunar') {
      return this.addLunarTexture(grid, template)
    } else if (theme === 'celestial') {
      return this.addCelestialTexture(grid, template)
    } else if (theme === 'geometric') {
      return this.addGeometricTexture(grid, template)
    }
    
    return false
  }

  private addLunarTexture(grid: string[][], template: PantTemplate): boolean {
    // Add small crater-like details
    const candidates: Array<{x: number, y: number}> = []
    
    for (let y = 1; y < grid.length - 1; y++) {
      for (let x = 1; x < grid[y].length - 1; x++) {
        // Look for areas near existing moon elements
        const neighbors = [
          grid[y-1][x], grid[y+1][x], grid[y][x-1], grid[y][x+1]
        ]
        if (neighbors.some(n => ['o', 'O', '0'].includes(n)) && grid[y][x] === ' ') {
          candidates.push({x, y})
        }
      }
    }
    
    if (candidates.length === 0) return false
    
    const target = candidates[Math.floor(this.seededRandom(1100) * candidates.length)]
    const craterChars = ['.', ',', '\'']
    const craterChar = craterChars[Math.floor(this.seededRandom(1200) * craterChars.length)]
    
    grid[target.y][target.x] = craterChar
    return true
  }

  private addCelestialTexture(grid: string[][], template: PantTemplate): boolean {
    // Add star-like points
    const emptySpaces: Array<{x: number, y: number}> = []
    
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === ' ') {
          emptySpaces.push({x, y})
        }
      }
    }
    
    if (emptySpaces.length === 0) return false
    
    const target = emptySpaces[Math.floor(this.seededRandom(1300) * emptySpaces.length)]
    const starChars = ['*', '.', '+']
    const starChar = starChars[Math.floor(this.seededRandom(1400) * starChars.length)]
    
    grid[target.y][target.x] = starChar
    return true
  }

  private addGeometricTexture(grid: string[][], template: PantTemplate): boolean {
    // Add geometric accents
    const lines: Array<{x: number, y: number}> = []
    
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (['|', '-'].includes(grid[y][x])) {
          lines.push({x, y})
        }
      }
    }
    
    if (lines.length === 0) return false
    
    const target = lines[Math.floor(this.seededRandom(1500) * lines.length)]
    const accentChars = ['+', '*', '.']
    const accentChar = accentChars[Math.floor(this.seededRandom(1600) * accentChars.length)]
    
    // Add accent at intersection or nearby
    const offsetX = Math.floor(this.seededRandom(1700) * 3) - 1
    const offsetY = Math.floor(this.seededRandom(1800) * 3) - 1
    const newX = Math.max(0, Math.min(grid[0].length - 1, target.x + offsetX))
    const newY = Math.max(0, Math.min(grid.length - 1, target.y + offsetY))
    
    if (grid[newY][newX] === ' ') {
      grid[newY][newX] = accentChar
      return true
    }
    
    return false
  }

  private calculateThemePreservation(original: string[][], modified: string[][], template: PantTemplate): number {
    let preservedElements = 0
    let totalElements = 0
    
    // Create a larger working area to handle size changes
    const maxHeight = Math.max(original.length, modified.length)
    const maxWidth = Math.max(
      ...original.map(row => row.length).concat(modified.map(row => row.length))
    )
    
    for (let y = 0; y < maxHeight; y++) {
      for (let x = 0; x < maxWidth; x++) {
        const origChar = y < original.length && x < original[y].length ? original[y][x] : ' '
        const modChar = y < modified.length && x < modified[y].length ? modified[y][x] : ' '
        
        // Only count non-space characters from the original
        if (origChar !== ' ') {
          totalElements++
          if (origChar === modChar || this.isThematicallySimilar(origChar, modChar, template)) {
            preservedElements++
          }
        }
      }
    }
    
    // Return as percentage (0-100)
    return totalElements > 0 ? Math.round((preservedElements / totalElements) * 100) : 100
  }

  private isThematicallySimilar(char1: string, char2: string, template: PantTemplate): boolean {
    if (char1 === char2) return true
    
    // Check if both are thematically appropriate
    const bothAllowed = template.allowedChars.includes(char1) && template.allowedChars.includes(char2)
    if (!bothAllowed) return false
    
    // Check for thematic similarity based on character categories
    const lunarChars = ['o', 'O', '0', '(', ')', '{', '}', '[', ']']
    const lineChars = ['|', '/', '\\', '-', '~', '_']
    const detailChars = ['.', '*', '\'', '`', ':', ',']
    const curveChars = ['(', ')', '{', '}', '[', ']', 'C', 'c', 's', 'S']
    const angularChars = ['/', '\\', 'V', 'v', 'L', 'l', 'A', '^']
    
    // Lunar theme similarity
    if (lunarChars.includes(char1) && lunarChars.includes(char2)) return true
    
    // Line/structure similarity
    if (lineChars.includes(char1) && lineChars.includes(char2)) return true
    
    // Detail/texture similarity
    if (detailChars.includes(char1) && detailChars.includes(char2)) return true
    
    // Curve similarity
    if (curveChars.includes(char1) && curveChars.includes(char2)) return true
    
    // Angular similarity
    if (angularChars.includes(char1) && angularChars.includes(char2)) return true
    
    // Special case: empty space to structure (acceptable in variations)
    if (char1 === ' ' && (lineChars.includes(char2) || curveChars.includes(char2))) return true
    if (char2 === ' ' && (lineChars.includes(char1) || curveChars.includes(char1))) return true
    
    return false
  }

  private countChanges(original: string[][], modified: string[][]): number {
    let changes = 0
    
    for (let y = 0; y < Math.min(original.length, modified.length); y++) {
      for (let x = 0; x < Math.min(original[y].length, modified[y].length); x++) {
        if (original[y][x] !== modified[y][x]) {
          changes++
        }
      }
    }
    
    return changes
  }

  /**
   * Validation utilities for testing determinism
   */
  static async validateDeterminism(seed: string, baseDesign: string = 'moon', iterations: number = 100): Promise<boolean> {
    const generator1 = new AsciiGenerator({ seed, baseDesign })
    const generator2 = new AsciiGenerator({ seed, baseDesign })
    
    for (let i = 0; i < iterations; i++) {
      const result1 = await generator1.generate()
      const result2 = await generator2.generate()
      
      if (result1.art !== result2.art) {
        console.error(`Determinism failed at iteration ${i}`)
        return false
      }
    }
    return true
  }

  static async testCollisionRate(seeds: string[], baseDesign: string = 'moon'): Promise<{ total: number; collisions: number; rate: number }> {
    const results = new Set<string>()
    let collisions = 0
    
    for (const seed of seeds) {
      const generator = new AsciiGenerator({ seed, baseDesign })
      const result = await generator.generate()
      
      if (results.has(result.art)) {
        collisions++
      }
      results.add(result.art)
    }
    
    return {
      total: seeds.length,
      collisions,
      rate: collisions / seeds.length
    }
  }

  static getAvailableBaseDesigns(): string[] {
    return ['moon', 'moon2', 'moon3', 'heart', 'lady', 'chudnovsky', 'headupbutt', 'hips', 'l', 'm', 'multi', 's', 'xl']
  }
}

/**
 * Utility functions for ASCII generation
 */
export async function generateAsciiArt(params: AsciiGenerationParams): Promise<GeneratedAscii> {
  const generator = new AsciiGenerator(params)
  return await generator.generate()
}

export async function generateDeterministicAscii(seed: string, baseDesign?: string): Promise<GeneratedAscii> {
  return await generateAsciiArt({
    seed,
    baseDesign: baseDesign || 'moon',
    variation: 'subtle',
    complexity: 3
  })
}

/**
 * Batch generation for testing
 */
export async function generateAsciiBatch(count: number, baseDesign?: string): Promise<GeneratedAscii[]> {
  const results: GeneratedAscii[] = []
  
  for (let i = 0; i < count; i++) {
    const seed = `test-seed-${i}-${Date.now()}`
    results.push(await generateDeterministicAscii(seed, baseDesign))
  }
  
  return results
}