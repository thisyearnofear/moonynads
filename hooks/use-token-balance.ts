'use client'

import { useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { M00NYNAD_TOKEN } from '@/lib/blockchain'

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
] as const

export function useTokenBalance(address?: string) {
  const { data: balance, isLoading, error } = useReadContract({
    address: M00NYNAD_TOKEN.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: !!address }
  })

  // Convert balance from wei to readable format
  const balanceFormatted = balance 
    ? parseFloat(formatUnits(balance, M00NYNAD_TOKEN.decimals))
    : 0

  // Check if user has required amount (250M tokens)
  const hasRequiredBalance = balanceFormatted >= 250_000_000

  return {
    balance: balanceFormatted,
    balanceRaw: balance,
    hasRequiredBalance,
    isLoading,
    error,
    formatted: formatBalance(balanceFormatted)
  }
}

function formatBalance(balance: number): string {
  if (balance >= 1_000_000_000) {
    return `${(balance / 1_000_000_000).toFixed(1)}B`
  }
  if (balance >= 1_000_000) {
    return `${(balance / 1_000_000).toFixed(1)}M`
  }
  if (balance >= 1_000) {
    return `${(balance / 1_000).toFixed(1)}K`
  }
  return balance.toFixed(2)
}