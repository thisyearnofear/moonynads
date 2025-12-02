export const PANTS = [
  { id: 'moon', name: 'Moon #1', rarity: 'common', description: 'The original moonynad - a classic lunar ASCII art piece' },
  { id: 'moon2', name: 'Moon #2', rarity: 'uncommon', description: 'A more detailed lunar landscape with craters and texture' },
  { id: 'moon3', name: 'Moon #3', rarity: 'common', description: 'Minimalist moon design with clean geometric lines' },
  { id: 'heart', name: 'Lunar Heart', rarity: 'rare', description: 'A heart-shaped moon - rare romantic edition' },
  { id: 'lady', name: 'Moon Lady', rarity: 'epic', description: 'Mystical lunar goddess with flowing robes' },
  { id: 'chudnovsky', name: 'Chudnovsky Moon', rarity: 'legendary', description: 'Complex mathematical moon pattern' },
  { id: 'headupbutt', name: 'Lunar Butt', rarity: 'uncommon', description: 'A cheeky moon with a playful twist' },
  { id: 'hips', name: 'Moon Hips', rarity: 'rare', description: 'Curvaceous lunar landscape' },
  { id: 'l', name: 'Lunar L', rarity: 'common', description: 'Abstract moon in the shape of letter L' },
  { id: 'm', name: 'Lunar M', rarity: 'common', description: 'Dual moon formation resembling letter M' },
  { id: 'multi', name: 'Multi-Moon', rarity: 'uncommon', description: 'A constellation of multiple moons' },
  { id: 's', name: 'Lunar S', rarity: 'rare', description: 'Crescent moon forming an S shape' },
  { id: 'xl', name: 'XL Moon', rarity: 'epic', description: 'Extra large lunar display' }
] as const

export const PANTS_IDS = PANTS.map(p => p.id)

