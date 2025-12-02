/**
 * Lunar-Themed Tier System for Moonynads
 * Progressive unlock based on m00nynad token holdings
 */

export interface TierConfig {
  id: string
  name: string
  moonPhase: string
  asciiArt: string
  description: string
  daysUnlockedMin: number
  daysUnlockedMax: number
  color: {
    light: string
    dark: string
    border: string
  }
}

export const TIER_CONFIGS: Record<string, TierConfig> = {
  none: {
    id: 'none',
    name: 'LUNAR VISITOR',
    moonPhase: '🌑',
    asciiArt: `╔═════════════════╗
║   🌑  LOCKED   🌑 ║
║                 ║
║   No Access Yet ║
╚═════════════════╝`,
    description: 'No early access',
    daysUnlockedMin: 0,
    daysUnlockedMax: 0,
    color: {
      light: 'text-gray-700',
      dark: 'dark:text-gray-400',
      border: 'border-gray-300 dark:border-gray-700'
    }
  },
  bronze: {
    id: 'bronze',
    name: 'CRESCENT HOLDER',
    moonPhase: '🌒',
    asciiArt: `╔═════════════════╗
║   🌒 CRESCENT  ║
║                 ║
║   Early Days    ║
╚═════════════════╝`,
    description: 'Crescent phase holder',
    daysUnlockedMin: 1,
    daysUnlockedMax: 3,
    color: {
      light: 'text-amber-700',
      dark: 'dark:text-amber-500',
      border: 'border-amber-300 dark:border-amber-700'
    }
  },
  silver: {
    id: 'silver',
    name: 'HALF MOON SEEKER',
    moonPhase: '🌓',
    asciiArt: `╔═════════════════╗
║  🌓 HALF MOON  ║
║                 ║
║   Growing Access║
╚═════════════════╝`,
    description: 'Half moon phase holder',
    daysUnlockedMin: 4,
    daysUnlockedMax: 6,
    color: {
      light: 'text-blue-700',
      dark: 'dark:text-blue-400',
      border: 'border-blue-300 dark:border-blue-700'
    }
  },
  gold: {
    id: 'gold',
    name: 'WAXING COLLECTOR',
    moonPhase: '🌔',
    asciiArt: `╔═════════════════╗
║  🌔  WAXING   ║
║                 ║
║  Major Access  ║
╚═════════════════╝`,
    description: 'Waxing moon collector',
    daysUnlockedMin: 7,
    daysUnlockedMax: 9,
    color: {
      light: 'text-yellow-700',
      dark: 'dark:text-yellow-500',
      border: 'border-yellow-300 dark:border-yellow-700'
    }
  },
  platinum: {
    id: 'platinum',
    name: 'LUNATIC ELITE',
    moonPhase: '🌕',
    asciiArt: `╔═════════════════╗
║  🌕 FULL MOON  ║
║                 ║
║   Elite Status  ║
╚═════════════════╝`,
    description: 'Elite lunar collector',
    daysUnlockedMin: 10,
    daysUnlockedMax: 11,
    color: {
      light: 'text-purple-700',
      dark: 'dark:text-purple-400',
      border: 'border-purple-300 dark:border-purple-700'
    }
  },
  diamond: {
    id: 'diamond',
    name: 'CELESTIAL WHALE',
    moonPhase: '⭐',
    asciiArt: `╔═════════════════╗
║  ⭐ CELESTIAL ⭐║
║                 ║
║  Ultimate Tier  ║
╚═════════════════╝`,
    description: 'Complete lunar mastery',
    daysUnlockedMin: 12,
    daysUnlockedMax: 12,
    color: {
      light: 'text-cyan-700',
      dark: 'dark:text-cyan-400',
      border: 'border-cyan-300 dark:border-cyan-700'
    }
  }
}

/**
 * Get tier configuration based on number of days unlocked
 */
export function getTierByDaysUnlocked(daysUnlocked: number): TierConfig {
  if (daysUnlocked === 0) return TIER_CONFIGS.none
  if (daysUnlocked <= 3) return TIER_CONFIGS.bronze
  if (daysUnlocked <= 6) return TIER_CONFIGS.silver
  if (daysUnlocked <= 9) return TIER_CONFIGS.gold
  if (daysUnlocked < 12) return TIER_CONFIGS.platinum
  return TIER_CONFIGS.diamond
}

/**
 * Get the ASCII art badge for a tier
 */
export function getTierAscii(tierId: string): string {
  return TIER_CONFIGS[tierId]?.asciiArt || TIER_CONFIGS.none.asciiArt
}

/**
 * Get moon phase emoji representing progression
 */
export function getMoonPhaseProgression(daysUnlocked: number): string {
  const phases = ['🌑', '🌒', '🌓', '🌔', '🌕']
  if (daysUnlocked === 0) return phases[0]
  if (daysUnlocked <= 3) return phases[1]
  if (daysUnlocked <= 6) return phases[2]
  if (daysUnlocked <= 9) return phases[3]
  if (daysUnlocked < 12) return phases[4]
  return '⭐' // Ultimate tier
}
