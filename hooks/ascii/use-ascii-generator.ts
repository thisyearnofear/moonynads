import { useState, useCallback, useEffect } from 'react'
import { 
  AsciiGenerator, 
  AsciiGenerationParams, 
  GeneratedAscii,
  generateAsciiArt,
  generateDeterministicAscii 
} from '@/lib/ascii-generator'

export interface UseAsciiGeneratorReturn {
  ascii: GeneratedAscii | null
  isGenerating: boolean
  error: string | null
  generate: (params: AsciiGenerationParams) => Promise<void>
  regenerate: () => Promise<void>
  lastParams: AsciiGenerationParams | null
}

export interface UseDeterministicAsciiReturn {
  ascii: GeneratedAscii | null
  isGenerating: boolean
  error: string | null
  generate: (seed: string, baseDesign?: string) => Promise<void>
}

export interface UseBatchAsciiGeneratorReturn {
  asciiCollection: GeneratedAscii[]
  isGenerating: boolean
  error: string | null
  generateBatch: (count: number, baseDesign?: string) => Promise<void>
  clearBatch: () => void
}

/**
 * Hook for generating ASCII art variations based on existing pant designs
 * Uses the deterministic generator that builds upon existing themes
 */
export function useAsciiGenerator(): UseAsciiGeneratorReturn {
  const [ascii, setAscii] = useState<GeneratedAscii | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastParams, setLastParams] = useState<AsciiGenerationParams | null>(null)

  const generate = useCallback(async (params: AsciiGenerationParams): Promise<void> => {
    try {
      setIsGenerating(true)
      setError(null)
      
      // Validate base design exists
      const availableDesigns = AsciiGenerator.getAvailableBaseDesigns()
      if (params.baseDesign && !availableDesigns.includes(params.baseDesign)) {
        throw new Error(`Invalid base design '${params.baseDesign}'. Available: ${availableDesigns.join(', ')}`)
      }
      
      // Generate ASCII art using existing pant template
      const result = await generateAsciiArt({
        seed: params.seed,
        baseDesign: params.baseDesign || 'moon',
        variation: params.variation || 'subtle',
        complexity: params.complexity || 3,
        preserveTheme: params.preserveTheme !== false
      })
      
      setAscii(result)
      setLastParams(params)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate ASCII art')
      console.error('ASCII generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const regenerate = useCallback(async (): Promise<void> => {
    if (lastParams) {
      // Add a small variation to the seed for regeneration
      const variedParams = {
        ...lastParams,
        seed: `${lastParams.seed}-regenerate-${Date.now()}`
      }
      await generate(variedParams)
    }
  }, [lastParams, generate])

  return { ascii, isGenerating, error, generate, regenerate, lastParams }
}

/**
 * Hook for simple deterministic ASCII generation
 * Perfect for wallet-based seed generation
 */
export function useDeterministicAscii(): UseDeterministicAsciiReturn {
  const [ascii, setAscii] = useState<GeneratedAscii | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (seed: string, baseDesign?: string): Promise<void> => {
    try {
      setIsGenerating(true)
      setError(null)
      
      const result = await generateDeterministicAscii(seed, baseDesign)
      setAscii(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate ASCII art')
      console.error('ASCII generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }, [])

  return { ascii, isGenerating, error, generate }
}

/**
 * Hook for batch ASCII generation
 * Useful for testing and preview collections
 */
export function useBatchAsciiGenerator(): UseBatchAsciiGeneratorReturn {
  const [asciiCollection, setAsciiCollection] = useState<GeneratedAscii[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateBatch = useCallback(async (count: number, baseDesign?: string): Promise<void> => {
    try {
      setIsGenerating(true)
      setError(null)
      
      const results: GeneratedAscii[] = []
      
      for (let i = 0; i < count; i++) {
        const seed = `batch-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const result = await generateDeterministicAscii(seed, baseDesign)
        results.push(result)
      }
      
      setAsciiCollection(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate ASCII batch')
      console.error('ASCII batch generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const clearBatch = useCallback(() => {
    setAsciiCollection([])
  }, [])

  return { asciiCollection, isGenerating, error, generateBatch, clearBatch }
}

/**
 * Utility function to get available base designs for UI
 */
export function getAvailableBaseDesigns(): Array<{id: string, name: string, rarity: string, description: string}> {
  const designs = AsciiGenerator.getAvailableBaseDesigns()
  
  return designs.map(id => ({
    id,
    name: getPantName(id),
    rarity: getPantRarity(id),
    description: getPantDescription(id)
  }))
}

// Helper functions (these should match the ones in the generator)
function getPantName(pantId: string): string {
  const nameMap: Record<string, string> = {
    'moon': 'Moon #1',
    'moon2': 'Moon #2',
    'moon3': 'Moon #3',
    'heart': 'Lunar Heart',
    'lady': 'Moon Lady',
    'chudnovsky': 'Chudnovsky Moon',
    'headupbutt': 'Lunar Butt',
    'multi': 'Multi-Moon',
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
    'multi': 'uncommon',
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
    'multi': 'A constellation of multiple moons',
    'xl': 'Extra large lunar display'
  }
  return descMap[pantId] || 'A unique ASCII art piece'
}