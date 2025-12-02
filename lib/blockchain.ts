// Consolidated blockchain utilities and types
import { CONFIG, getTokenId, getRarityFromMintOrder } from './contracts'

export interface TokenMetadata {
  name: string
  description: string
  image: string
  external_url: string
  attributes: Array<{ trait_type: string; value: string | number }>
  properties: Record<string, unknown>
}

export function generateTokenMetadata(
  tokenId: number,
  artContent: string,
  baseData: { id: string; name: string; description: string; rarity: string }
): TokenMetadata {
  const variant = tokenId > 1000 ? tokenId % 1000 : 0
  const finalRarity = variant > 0 ? getRarityFromMintOrder(variant) : baseData.rarity

  return {
    name: variant > 0 ? `${baseData.name} #${variant}` : baseData.name,
    description: `${baseData.description}\n\n🌙 Part of the Moonynads collection on Monad blockchain. Collect m00nynad tokens and rare ASCII art NFTs!`,
    image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/image/${tokenId}`,
    external_url: process.env.NEXT_PUBLIC_BASE_URL || 'https://moonynads.xyz',
    attributes: [
      { trait_type: 'Rarity', value: finalRarity },
      { trait_type: 'Art Type', value: 'ASCII' },
      { trait_type: 'Collection', value: 'Moonynads' },
      { trait_type: 'Theme', value: 'Lunar' },
      { trait_type: 'Network', value: 'Monad' },
      { trait_type: 'Memetoken', value: M00NYNAD_TOKEN.symbol },
      ...(variant > 0 ? [
        { trait_type: 'Advent Day', value: `Day ${Math.ceil(getTokenId(baseData.id) + 12)}` },
        { trait_type: 'Mint Order', value: variant }
      ] : [])
    ],
    properties: {
      ascii_content: artContent,
      category: 'Digital Art',
      creator: 'Moonynads Team',
      memetoken_address: M00NYNAD_TOKEN.address,
      network: 'Monad Mainnet',
      chain_id: CONFIG.network.chainId
    }
  }
}

export function generateTokenSVG(asciiContent: string, tokenId: number): string {
  const lines = asciiContent.split('\n')
  const maxLength = Math.max(...lines.map(line => line.length))
  const charWidth = 8
  const charHeight = 14
  const padding = 20
  const width = Math.max(400, maxLength * charWidth + padding * 2)
  const height = lines.length * charHeight + padding * 2

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .ascii { font-family: 'Courier New', monospace; font-size: 12px; fill: #f4f4f5; }
    .bg { fill: #0a0a0b; }
    .border { fill: none; stroke: #eab308; stroke-width: 2; }
  </style>
  <rect class="bg" width="100%" height="100%" />
  <rect class="border" x="1" y="1" width="${width - 2}" height="${height - 2}" rx="8" />
  <text class="ascii" x="${padding}" y="${padding + charHeight}">
${lines.map((line, i) => `    <tspan x="${padding}" dy="${i === 0 ? 0 : charHeight}">${line.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m] || m))}</tspan>`).join('\n')}
  </text>
  <text x="${width - padding}" y="${height - 10}" text-anchor="end" font-family="monospace" font-size="10" fill="#eab308">
    Moonynad #${tokenId}
  </text>
</svg>`
}

// m00nad memetoken configuration
export const M00NYNAD_TOKEN = {
  address: '0x22cd99ec337a2811f594340a4a6e41e4a3022b07',
  symbol: 'm00nad',
  decimals: 18,
  name: 'm00nad'
} as const

// Advent calendar unlock thresholds (in tokens)
// Days 13-24 progressively unlock with increasing token requirements
export const ADVENT_UNLOCK_THRESHOLDS = {
  13: 250_000_000,   // 250M - Crescent Holder tier begins
  14: 350_000_000,   // 350M
  15: 450_000_000,   // 450M
  16: 550_000_000,   // 550M - Half Moon tier
  17: 650_000_000,   // 650M
  18: 750_000_000,   // 750M
  19: 850_000_000,   // 850M - Waxing Collector tier
  20: 950_000_000,   // 950M
  21: 1_050_000_000, // 1.05B
  22: 1_150_000_000, // 1.15B - Lunatic Elite tier
  23: 1_250_000_000, // 1.25B
  24: 1_350_000_000  // 1.35B - Celestial Whale (complete access)
} as const

// Network switching utilities
export const NETWORK_CONFIG = {
  chainId: `0x${CONFIG.network.chainId.toString(16)}`, // 0x8F for 143
  chainName: CONFIG.network.name,
  nativeCurrency: {
    name: CONFIG.network.currency,
    symbol: CONFIG.network.currency,
    decimals: 18,
  },
  rpcUrls: [CONFIG.network.rpc],
  blockExplorerUrls: [CONFIG.network.explorer],
} as const

export async function switchToMonadNetwork() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not detected')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: NETWORK_CONFIG.chainId }],
    })
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [NETWORK_CONFIG],
        })
      } catch (addError) {
        throw new Error('Failed to add Monad network to wallet')
      }
    } else {
      throw new Error('Failed to switch to Monad network')
    }
  }
}

export { CONFIG, getTokenId, getRarityFromMintOrder }