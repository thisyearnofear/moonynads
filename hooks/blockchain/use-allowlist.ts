'use client'

import { useAccount } from 'wagmi'
import { CONFIG } from '@/lib/contracts'

interface AllowlistStatus {
  isAllowlisted: boolean
  tier: 0 | 1 | 2
  tierName: string
  priceM00nad: number
  isFree: boolean
}

export function useAllowlist(addressToCheck?: string) {
  const { address } = useAccount()
  const userAddress = addressToCheck || address

  const getTierInfo = (tier: number): AllowlistStatus => {
    const tierConfig = CONFIG.allowlist.tiers[tier as keyof typeof CONFIG.allowlist.tiers] || CONFIG.allowlist.tiers[0]
    const priceM00nad = tier === 1 ? CONFIG.advent.discountPriceM00nad : (tier === 2 ? 0 : CONFIG.advent.mintPriceM00nad)
    
    return {
      isAllowlisted: tier > 0,
      tier: tier as 0 | 1 | 2,
      tierName: tierConfig.name,
      priceM00nad,
      isFree: tier === 2
    }
  }

  return {
    getTierInfo,
    tiers: CONFIG.allowlist.tiers,
    standardPrice: CONFIG.advent.mintPriceM00nad,
    discountPrice: CONFIG.advent.discountPriceM00nad
  }
}
