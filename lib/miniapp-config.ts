/**
 * Moonynads Mini App Configuration
 * Single source of truth for all Farcaster Mini App settings
 */

export const MINIAPP_CONFIG = {
  version: '1',
  name: 'Moonynads',
  homeUrl: 'https://m00nynads.vercel.app',
  iconUrl: 'https://m00nynads.vercel.app/moonynadssquare.png', // 1024x1024 PNG
  imageUrl: 'https://m00nynads.vercel.app/moonynad-embed.png', // 1200x800 (3:2 ratio)
  buttonTitle: '🌙 Explore Gallery',
  splashImageUrl: 'https://m00nynads.vercel.app/moonynad-splash.png', // 200x200 PNG
  splashBackgroundColor: '#0a0a0b',
} as const

export const MINIAPP_METADATA = {
  subtitle: 'Token-Gated ASCII Art NFTs',
  description: 'Collect unique lunar ASCII art NFTs through dynamic advent calendar drops on Monad blockchain',
  tagline: '12 Days of lunar NFTs',
  primaryCategory: 'art-creativity' as const,
  tags: ['nft', 'ascii-art', 'monad', 'advent', 'art'],
  heroImageUrl: 'https://m00nynads.vercel.app/moonynadsbanner.png', // 1200x630 PNG
  screenshotUrls: ['https://m00nynads.vercel.app/moonynadsbanner.png'],
} as const

export const MINIAPP_OPENGRAPH = {
  ogTitle: 'Moonynads Gallery',
  ogDescription: '12 Days of lunar ASCII art NFTs with dynamic minting mechanics',
  ogImageUrl: 'https://m00nynads.vercel.app/og-image.png', // 1200x630 PNG
} as const

/**
 * Generate fc:miniapp embed for sharing
 */
export function generateMiniAppEmbed() {
  return {
    version: MINIAPP_CONFIG.version,
    imageUrl: MINIAPP_CONFIG.imageUrl,
    button: {
      title: MINIAPP_CONFIG.buttonTitle,
      action: {
        type: 'launch_miniapp',
        name: MINIAPP_CONFIG.name,
        url: MINIAPP_CONFIG.homeUrl,
        splashImageUrl: MINIAPP_CONFIG.splashImageUrl,
        splashBackgroundColor: MINIAPP_CONFIG.splashBackgroundColor,
      },
    },
  }
}

/**
 * Generate manifest object for .well-known/farcaster.json
 */
export function generateManifest(accountAssociation: object) {
  return {
    accountAssociation,
    miniapp: {
      version: MINIAPP_CONFIG.version,
      name: MINIAPP_CONFIG.name,
      homeUrl: MINIAPP_CONFIG.homeUrl,
      iconUrl: MINIAPP_CONFIG.iconUrl,
      imageUrl: MINIAPP_CONFIG.imageUrl,
      buttonTitle: MINIAPP_CONFIG.buttonTitle,
      splashImageUrl: MINIAPP_CONFIG.splashImageUrl,
      splashBackgroundColor: MINIAPP_CONFIG.splashBackgroundColor,
      ...MINIAPP_METADATA,
      ...MINIAPP_OPENGRAPH,
      requiredCapabilities: ['actions.ready', 'actions.composeCast'],
    },
  }
}
