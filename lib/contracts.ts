// Consolidated Moonynads Contract Configuration for Monad
export const MOONYNADS_CONTRACT = {
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000',
  abi: [
    // ERC721 Standard Functions
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function totalSupply() view returns (uint256)',
    'function tokenURI(uint256 tokenId) view returns (string)',
    'function ownerOf(uint256 tokenId) view returns (address)',
    'function balanceOf(address owner) view returns (uint256)',
    'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
    
    // Moonynads Specific Functions
    'function mint(address to, uint256 tokenId) external',
    'function safeMint(address to, uint256 tokenId) external',
    'function setTokenURI(uint256 tokenId, string uri) external',
    'function pause() external',
    'function unpause() external',
    'function paused() view returns (bool)',
    
    // Payment Configuration
    'function m00nadToken() view returns (address)',
    'function MINT_PRICE_M00NAD() view returns (uint256)',
    'function DISCOUNT_PRICE_M00NAD() view returns (uint256)',
    
    // Advent Calendar Functions
    'function isAdventDay(uint256 day) view returns (bool)',
    'function mintAdventToken(uint256 day) external',
    'function mintAdventTokenAllowlist(uint256 day) external',
    'function getAdventTokenId(uint256 day) view returns (uint256)',
    'function isAdventTokenMinted(uint256 day, address user) view returns (bool)',
    
    // Allowlist Functions
    'function setAllowlist(address[] calldata addresses, uint256[] calldata tiers) external',
    'function getAllowlistTier(address user) view returns (uint256)',
    'function isAllowlisted(address user) view returns (bool)',
    'function allowlistTier(address user) view returns (uint256)',
    'function allowlistMinted(uint256 day, address user) view returns (bool)',
    
    // Rarity and Metadata
    'function getTokenRarity(uint256 tokenId) view returns (string)',
    
    // Events
    'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
    'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
    'event AdventTokenMinted(address indexed user, uint256 indexed day, uint256 indexed tokenId)',
    'event RaritySet(uint256 indexed tokenId, string rarity)',
    'event AllowlistUpdated(address[] indexed addresses, uint256[] tiers)',
    'event AllowlistMint(address indexed user, uint256 indexed day, uint256 tier)'
  ]
} as const

// Core configuration - single source of truth
export const CONFIG = {
  network: {
    chainId: 143,
    name: 'Monad Mainnet',
    currency: 'MON',
    rpc: 'https://rpc.monad.xyz',
    explorer: 'https://monadvision.com'
  },
  contract: MOONYNADS_CONTRACT,
  advent: {
    startDay: 13,
    endDay: 24,
    mintPriceM00nad: 100_000_000, // 100M tokens
    discountPriceM00nad: 50_000_000, // 50M tokens (allowlist)
    dailyLimit: 100
  },
  allowlist: {
    tiers: {
      0: { name: 'None', discount: 0 },
      1: { name: 'Discount', discount: 50_000_000 },
      2: { name: 'Free', discount: 0 }
    }
  },
  rarity: {
    legendary: { threshold: 5, color: '#FFD700' },
    epic: { threshold: 15, color: '#EF4444' },
    rare: { threshold: 35, color: '#3B82F6' },
    uncommon: { threshold: 70, color: '#10B981' },
    common: { threshold: Infinity, color: '#9CA3AF' }
  }
} as const

// Utility functions for contract interactions
export function getTokenId(artId: string): number {
  const mapping: Record<string, number> = {
    moon: 1, moon2: 2, moon3: 3, heart: 4, lady: 5, chudnovsky: 6,
    headupbutt: 7, multi: 8, xl: 9
  }
  return mapping[artId] || 0
}

export function getRarityFromMintOrder(mintOrder: number): keyof typeof CONFIG.rarity {
  for (const [rarity, config] of Object.entries(CONFIG.rarity)) {
    if (mintOrder <= config.threshold) {
      return rarity as keyof typeof CONFIG.rarity
    }
  }
  return 'common'
}