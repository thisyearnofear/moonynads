'use client'

import { useTokenBalance } from '@/hooks/blockchain/use-token-balance'
import { ADVENT_UNLOCK_THRESHOLDS } from '@/lib/blockchain'

export function useAdventAccess(address?: string) {
  const { balance, isLoading, error, formatted } = useTokenBalance(address)

  // Calculate which days the user can access
  const getAccessibleDays = () => {
    const accessibleDays: number[] = []
    
    for (const [day, threshold] of Object.entries(ADVENT_UNLOCK_THRESHOLDS)) {
      if (balance >= threshold) {
        accessibleDays.push(parseInt(day))
      }
    }
    
    return accessibleDays
  }

  // Get the next unlock threshold the user needs to reach
  const getNextUnlock = () => {
    for (const [day, threshold] of Object.entries(ADVENT_UNLOCK_THRESHOLDS)) {
      if (balance < threshold) {
        return {
          day: parseInt(day),
          threshold,
          shortfall: threshold - balance,
          formattedThreshold: formatBalance(threshold),
          formattedShortfall: formatBalance(threshold - balance)
        }
      }
    }
    return null // User has access to everything
  }

  // Get the highest tier the user has unlocked
  const getHighestUnlockedDay = () => {
    let highestDay = 0
    
    for (const [day, threshold] of Object.entries(ADVENT_UNLOCK_THRESHOLDS)) {
      if (balance >= threshold) {
        highestDay = Math.max(highestDay, parseInt(day))
      }
    }
    
    return highestDay > 0 ? highestDay : null
  }

  // Check if user can access specific day
  const canAccessDay = (day: number) => {
    const threshold = ADVENT_UNLOCK_THRESHOLDS[day as keyof typeof ADVENT_UNLOCK_THRESHOLDS]
    return threshold ? balance >= threshold : false
  }

  // Get user's access tier description
  const getAccessTier = () => {
    const accessibleDays = getAccessibleDays()
    const dayCount = accessibleDays.length
    
    if (dayCount === 0) return { tier: 'none', description: 'Awaiting lunar alignment' }
    if (dayCount <= 3) return { tier: 'bronze', description: `${dayCount} day${dayCount === 1 ? '' : 's'} unlocked` }
    if (dayCount <= 6) return { tier: 'silver', description: `${dayCount} days unlocked` }
    if (dayCount <= 9) return { tier: 'gold', description: `${dayCount} days unlocked` }
    if (dayCount < 12) return { tier: 'platinum', description: `${dayCount} days unlocked` }
    return { tier: 'diamond', description: 'All lunar secrets revealed' }
  }

  const accessibleDays = getAccessibleDays()
  const nextUnlock = getNextUnlock()
  const highestUnlockedDay = getHighestUnlockedDay()
  const accessTier = getAccessTier()

  return {
    balance,
    formatted,
    isLoading,
    error,
    accessibleDays,
    nextUnlock,
    highestUnlockedDay,
    accessTier,
    canAccessDay,
    totalDaysUnlocked: accessibleDays.length,
    hasAnyAccess: accessibleDays.length > 0,
    hasCompleteAccess: accessibleDays.length === Object.keys(ADVENT_UNLOCK_THRESHOLDS).length
  }
}

function formatBalance(balance: number): string {
  if (balance >= 1_000_000_000) {
    return `${(balance / 1_000_000_000).toFixed(1)}B`
  }
  if (balance >= 1_000_000) {
    return `${(balance / 1_000_000).toFixed(0)}M`
  }
  if (balance >= 1_000) {
    return `${(balance / 1_000).toFixed(0)}K`
  }
  return balance.toFixed(0)
}