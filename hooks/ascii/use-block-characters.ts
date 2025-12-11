import { useMemo, useState, useRef, useEffect } from 'react'
import {
  generateBlockCharacterAscii,
  createStyledBlockHTML,
  renderBlockCharactersToCanvas,
  exportAsHTML,
  type BlockRenderMode,
} from '@/lib/block-character-ascii'

export type ColorPalette = 'moon' | 'fire' | 'forest' | 'grayscale' | 'sunset'

interface UseBlockCharactersOptions {
  baseArt: string
  mode?: BlockRenderMode
  palette?: ColorPalette
  intensity?: number
  contrastLevel?: number
}

export function useBlockCharacters(options: UseBlockCharactersOptions) {
  const {
    baseArt,
    mode = 'shading',
    palette = 'moon',
    intensity = 50,
    contrastLevel = 50,
  } = options

  const [localMode, setLocalMode] = useState<BlockRenderMode>(mode)
  const [localPalette, setLocalPalette] = useState<ColorPalette>(palette)
  const [localIntensity, setLocalIntensity] = useState(intensity)
  const [localContrast, setLocalContrast] = useState(contrastLevel)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const rendered = useMemo(() => {
    return generateBlockCharacterAscii({
      baseArt,
      mode: localMode,
      palette: localPalette,
      intensity: localIntensity,
      contrastLevel: localContrast,
    })
  }, [baseArt, localMode, localPalette, localIntensity, localContrast])

  const { html, css } = useMemo(() => {
    return createStyledBlockHTML({
      baseArt,
      mode: localMode,
      palette: localPalette,
      intensity: localIntensity,
      contrastLevel: localContrast,
    })
  }, [baseArt, localMode, localPalette, localIntensity, localContrast])

  useEffect(() => {
    if (canvasRef.current && localMode !== 'none') {
      renderBlockCharactersToCanvas(canvasRef.current, {
        baseArt,
        mode: localMode,
        palette: localPalette,
        intensity: localIntensity,
        contrastLevel: localContrast,
      })
    }
  }, [baseArt, localMode, localPalette, localIntensity, localContrast])

  const downloadAsHTML = () => {
    const htmlContent = exportAsHTML({
      baseArt,
      mode: localMode,
      palette: localPalette,
      intensity: localIntensity,
      contrastLevel: localContrast,
    })

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ascii-block-${localPalette}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAsText = () => {
    const blob = new Blob([rendered.art], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ascii-block-${localPalette}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadCanvasPNG = () => {
    if (!canvasRef.current) return
    canvasRef.current.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ascii-block-${localPalette}.png`
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  return {
    // Rendered output
    art: rendered.art,
    html,
    css,
    withColors: rendered.withColors,
    canvasRef,

    // State
    mode: localMode,
    palette: localPalette,
    intensity: localIntensity,
    contrastLevel: localContrast,

    // Controls
    setMode: setLocalMode,
    setPalette: setLocalPalette,
    setIntensity: setLocalIntensity,
    setContrastLevel: setLocalContrast,

    // Export functions
    downloadAsHTML,
    downloadAsText,
    downloadCanvasPNG,

    // Metadata
    modes: ['none', 'shading', 'solid', 'gradient', 'pattern', 'boxdraw'] as BlockRenderMode[],
    palettes: ['moon', 'fire', 'forest', 'grayscale', 'sunset'] as ColorPalette[],
  }
}

export function getBlockModeDescription(mode: BlockRenderMode): string {
  const descriptions: Record<BlockRenderMode, string> = {
    none: 'Original ASCII without block characters',
    shading: 'Light/dark shading blocks (░▒▓█)',
    solid: 'Solid color fills based on line density',
    gradient: 'Multi-level gradient fills',
    pattern: 'Pattern-based fills',
    boxdraw: 'Box-drawing characters',
  }
  return descriptions[mode]
}

export function getPaletteDescription(palette: ColorPalette): string {
  const descriptions: Record<ColorPalette, string> = {
    moon: 'Cool lunar blues and grays',
    fire: 'Warm fire reds and yellows',
    forest: 'Natural greens and teals',
    grayscale: 'Neutral black and white',
    sunset: 'Vibrant purples and pinks',
  }
  return descriptions[palette]
}
