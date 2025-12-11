/**
 * Block/shading character ASCII rendering with background fills
 * Uses Unicode box-drawing and block elements for rich visual effects
 */

export type BlockRenderMode = 
  | 'none'
  | 'shading'        // Light/dark shading blocks
  | 'solid'          // Solid fills with colors
  | 'gradient'       // Multi-level grayscale blocks
  | 'pattern'        // Pattern fills (░▒▓)
  | 'boxdraw'        // Box-drawing characters

/**
 * Comprehensive block character mappings by density level
 */
const BLOCK_RAMPS = {
  // Shading progression (░ ▒ ▓ █)
  shading: [' ', '░', '▒', '▓', '█'],
  
  // More detailed shading with quarter blocks
  quartiles: [' ', '░', '▒', '▓', '█'],
  
  // Mixed blocks and characters
  mixed: [' ', '∘', '·', '°', 'o', 'O', '●', '█'],
  
  // Box drawing and blocks
  boxdraw: [' ', '┌', '┬', '┤', '█'],
  
  // Monospace compatibility blocks
  compat: [' ', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'],
  
  // High-density variant
  dense: [' ', '░', '░', '▒', '▒', '▓', '▓', '█', '█'],
  
  // Organic shapes
  organic: [' ', 'o', 'O', '@', '#'],
}

type BlockRampType = keyof typeof BLOCK_RAMPS

/**
 * Color palette for background fills
 */
const COLOR_PALETTES = {
  moon: [
    '#1a1a2e',  // very dark blue
    '#16213e',  // dark blue
    '#0f3460',  // medium blue
    '#2d5a7b',  // lighter blue
    '#6b8cae',  // light blue
    '#a8c5dd',  // pale blue
  ],
  
  fire: [
    '#1a0000',  // very dark red
    '#4a0000',  // dark red
    '#8b2500',  // red-orange
    '#ff5722',  // orange
    '#ff9100',  // yellow-orange
    '#ffeb3b',  // yellow
  ],
  
  forest: [
    '#0a1f0f',  // very dark green
    '#1a3a1f',  // dark green
    '#2d5a3d',  // medium green
    '#4a8a5e',  // light green
    '#7ab88a',  // pale green
    '#b8d4c8',  // very pale green
  ],
  
  grayscale: [
    '#000000',
    '#1a1a1a',
    '#404040',
    '#666666',
    '#999999',
    '#cccccc',
  ],
  
  sunset: [
    '#0b0b1a',  // dark purple
    '#2d1a4a',  // purple
    '#6b2d5e',  // magenta
    '#a64a7a',  // pink
    '#d97fa6',  // light pink
    '#f0c8d8',  // very light pink
  ],
}

type PaletteType = keyof typeof COLOR_PALETTES

/**
 * Calculate character brightness for block rendering
 */
function getCharDensity(char: string): number {
  const densityMap: Record<string, number> = {
    ' ': 0,
    '.': 5,
    ',': 5,
    "'": 8,
    '`': 8,
    '^': 10,
    '_': 12,
    '-': 15,
    '~': 20,
    ':': 25,
    ';': 28,
    '!': 30,
    '|': 35,
    '/': 40,
    '\\': 40,
    'c': 45,
    'l': 45,
    'i': 45,
    'o': 60,
    'O': 70,
    '0': 75,
    '@': 90,
    '#': 95,
    '%': 85,
    '&': 88,
  }
  return densityMap[char] ?? 50
}

/**
 * Calculate line density (0-100)
 */
function calculateLineDensity(line: string): number {
  if (line.length === 0) return 0
  const nonSpace = line.split('').filter(c => c !== ' ').length
  return (nonSpace / line.length) * 100
}

/**
 * Select appropriate block ramp based on content
 */
function selectBlockRamp(baseArt: string): BlockRampType {
  const hasDenseRegions = /[#@%&]{3,}/.test(baseArt)
  const hasOrganic = /[oO0(){}]/i.test(baseArt)
  
  if (hasDenseRegions) return 'dense'
  if (hasOrganic) return 'organic'
  return 'shading'
}

export interface BlockCharacterParams {
  baseArt: string
  mode: BlockRenderMode
  palette: PaletteType
  intensity: number // 0-100
  contrastLevel: number // 0-100, how extreme the coloring
}

/**
 * Generate block character version with colored fills
 */
export function generateBlockCharacterAscii(params: BlockCharacterParams) {
  const { baseArt, mode, palette, intensity, contrastLevel } = params
  
  if (mode === 'none') return { art: baseArt, withColors: false }
  
  const lines = baseArt.split('\n')
  const ramp = BLOCK_RAMPS[selectBlockRamp(baseArt)] as string[]
  const colors = COLOR_PALETTES[palette]
  
  const result = lines.map((line, lineIndex) => {
    const lineDensity = calculateLineDensity(line)
    const lineColorIndex = Math.floor((lineDensity / 100) * (colors.length - 1))
    const lineColor = colors[lineColorIndex]
    
    return {
      text: line.split('').map((char, charIndex) => {
        if (char === ' ') return { char, color: null }
        
        const charDensity = getCharDensity(char)
        const adjustedDensity = Math.min(100, charDensity + (intensity * 0.3))
        
        const rampIndex = Math.round((adjustedDensity / 100) * (ramp.length - 1))
        const clampedIndex = Math.max(0, Math.min(ramp.length - 1, rampIndex))
        const newChar = ramp[clampedIndex]
        
        return {
          char: newChar,
          color: mode === 'solid' || mode === 'gradient' ? lineColor : null,
        }
      }),
      bgColor: mode === 'solid' || mode === 'gradient' ? lineColor : null,
    }
  })
  
  return {
    art: result.map(line => line.text.map(c => c.char).join('')).join('\n'),
    lines: result,
    withColors: true,
    palette,
    mode,
  }
}

/**
 * Create styled HTML from block character rendering
 */
export function createStyledBlockHTML(
  params: BlockCharacterParams
): { html: string; css: string } {
  const rendered = generateBlockCharacterAscii(params)
  
  const css = `
    .ascii-block-container {
      font-family: 'Monaco', 'Courier New', monospace;
      line-height: 1.2;
      font-size: 14px;
      letter-spacing: 0;
      white-space: pre;
    }
    
    .ascii-block-line {
      display: flex;
      height: 1.2em;
    }
    
    .ascii-block-char {
      width: 1em;
      height: 1.2em;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
  `
  
  const html = rendered.lines ? rendered.lines.map((line, i) => {
    const style = line.bgColor 
      ? `style="background-color: ${line.bgColor}; color: ${getContrastColor(line.bgColor)}"`
      : ''
    
    const chars = line.text.map((c, j) => {
      const charStyle = c.color
        ? `style="color: ${c.color}"`
        : ''
      return `<span class="ascii-block-char" ${charStyle}>${c.char}</span>`
    }).join('')
    
    return `<div class="ascii-block-line" ${style}>${chars}</div>`
  }).join('') : ''
  
  return {
    css,
    html: `<div class="ascii-block-container">${html}</div>`,
  }
}

/**
 * Get contrasting text color for background
 */
function getContrastColor(bgColor: string): string {
  // Simple luminance calculation
  const hex = bgColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const luminance = (r * 299 + g * 587 + b * 114) / 1000
  return luminance > 128 ? '#000000' : '#ffffff'
}

/**
 * Create canvas-based rendering for better color support
 */
export function renderBlockCharactersToCanvas(
  canvas: HTMLCanvasElement,
  params: BlockCharacterParams
): void {
  const rendered = generateBlockCharacterAscii(params)
  const ctx = canvas.getContext('2d')
  if (!ctx || !rendered.lines) return
  
  const charWidth = 12
  const charHeight = 20
  const padding = 20
  
  canvas.width = Math.max(400, rendered.lines[0]?.text.length || 0) * charWidth + padding * 2
  canvas.height = rendered.lines.length * charHeight + padding * 2
  
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  ctx.font = `bold 16px 'Monaco', 'Courier New', monospace`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  
  rendered.lines.forEach((line, i) => {
    const y = padding + i * charHeight
    
    // Draw background for entire line if needed
    if (line.bgColor && params.mode === 'solid') {
      ctx.fillStyle = line.bgColor
      ctx.fillRect(padding, y, line.text.length * charWidth, charHeight)
    }
    
    // Draw each character
    line.text.forEach((char, j) => {
      const x = padding + j * charWidth
      ctx.fillStyle = char.color || '#ffffff'
      ctx.fillText(char.char, x, y)
    })
  })
}

/**
 * Export as HTML string for embedding
 */
export function exportAsHTML(params: BlockCharacterParams): string {
  const { html, css } = createStyledBlockHTML(params)
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #000; margin: 0; padding: 20px; }
    ${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>
  `.trim()
}
