'use client'

import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { useAdventAccess } from '@/hooks/use-advent-access'
import { M00NYNAD_TOKEN, CONFIG } from '@/lib/blockchain'
import { WalletConnect } from './wallet-connect'
import { getTierByDaysUnlocked } from '@/lib/tier-system'
import { isDemoMode } from '@/lib/demo-mode'

interface TokenGateProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  day?: number // Optional specific day to check access for
}

export function TokenGate({ children, fallback, day }: TokenGateProps) {
  const { address, isConnected } = useAccount()
  const { 
    balance, 
    formatted, 
    isLoading, 
    hasAnyAccess, 
    hasCompleteAccess,
    canAccessDay,
    nextUnlock,
    accessTier,
    totalDaysUnlocked 
  } = useAdventAccess(address)
  
  const [demoMode, setDemoMode] = useState(false)
  
  useEffect(() => {
    setDemoMode(isDemoMode())
  }, [])

  // Demo mode: bypass all checks
  if (demoMode) {
    return (
      <div>
        {/* Subtle indicator - only in footer, not intrusive */}
        {children}
      </div>
    )
  }

  // If not connected, show connection prompt
  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-mono font-bold text-yellow-700 dark:text-yellow-500">
            Token-Gated Collection
          </h3>
          <p className="text-sm text-foreground/70 leading-relaxed">
            Connect your wallet holding <span className="font-mono text-yellow-600">250M+ {M00NYNAD_TOKEN.symbol}</span> to view the complete collection.
          </p>
          <p className="text-xs text-foreground/50">
            Each piece unlocks when you meet the balance requirement before its advent day.
          </p>
          <div className="pt-4">
            <WalletConnect />
          </div>
          <div className="pt-4 border-t border-yellow-600/20">
            <a
              href={`${CONFIG.network.explorer}/address/${M00NYNAD_TOKEN.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-yellow-600 hover:text-yellow-500 transition-colors font-mono"
            >
              Get {M00NYNAD_TOKEN.symbol} Tokens ↗
            </a>
          </div>
        </div>
        {fallback && <div className="mt-8">{fallback}</div>}
      </div>
    )
  }

  // If loading balance
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
        <p className="font-mono text-sm text-foreground/70">
          Checking {M00NYNAD_TOKEN.symbol} balance...
        </p>
      </div>
    )
  }

  // If insufficient balance
  if (!hasAnyAccess && balance > 0) {
    const nextThreshold = nextUnlock?.threshold || 250_000_000
    const shortfall = nextThreshold - balance
    
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-6xl mb-4">🌑</div>
          <h3 className="text-xl font-mono font-bold text-yellow-700 dark:text-yellow-500">
            Lunar Alignment Required
          </h3>
          <div className="space-y-2 text-sm text-foreground/70">
            <p>
              Current balance: <span className="font-mono text-yellow-600">{formatted} {M00NYNAD_TOKEN.symbol}</span>
            </p>
            <p>
              Needed for access: <span className="font-mono text-yellow-600">{nextUnlock?.formattedThreshold || '250M'}</span>
            </p>
            <p>
              Shortfall: <span className="font-mono text-orange-600">{formatShortfall(shortfall)}</span>
            </p>
          </div>
          <p className="text-xs text-foreground/50">
            Accumulate {M00NYNAD_TOKEN.symbol} to unlock lunar tiers and access the collection.
          </p>
          <div className="pt-4 border-t border-yellow-600/20 space-y-2">
            <a
              href={`${CONFIG.network.explorer}/address/${M00NYNAD_TOKEN.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-yellow-600 hover:text-yellow-500 transition-colors font-mono"
            >
              Acquire {M00NYNAD_TOKEN.symbol} ↗
            </a>
            <button
              onClick={() => window.location.reload()}
              className="block mx-auto text-xs text-foreground/50 hover:text-foreground/70 transition-colors"
            >
              🔄 Refresh Balance
            </button>
          </div>
        </div>
        {fallback && <div className="mt-8">{fallback}</div>}
      </div>
    )
  }

  // If user has access, show the gated content with their tier
  const tierConfig = getTierByDaysUnlocked(totalDaysUnlocked)
  
  return (
    <div>
      {/* Lunar Tier Badge */}
      <div className="mb-8 bg-background/50 border-2 border-yellow-600/30 rounded-lg overflow-hidden">
        {/* ASCII Art Background */}
        <div className="bg-background/80 p-4 border-b border-yellow-600/20">
          <pre className="font-mono text-xs text-yellow-600/60 dark:text-yellow-500/60 text-center overflow-auto max-h-24">
{getTierAsciiDisplay(tierConfig)}
          </pre>
        </div>
        
        {/* Tier Info */}
        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <div className="text-4xl">{tierConfig.moonPhase}</div>
            <div className={`font-mono text-xl font-bold ${tierConfig.color.light} ${tierConfig.color.dark} tracking-widest`}>
              {tierConfig.name}
            </div>
            <div className="font-mono text-sm text-foreground/70">
              {tierConfig.description}
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-yellow-600/20">
            <div className="text-center">
              <div className="font-mono text-xs text-foreground/50 mb-1">BALANCE</div>
              <div className="font-mono font-bold text-yellow-600 dark:text-yellow-500">
                {formatted} {M00NYNAD_TOKEN.symbol}
              </div>
            </div>
            <div className="text-center">
              <div className="font-mono text-xs text-foreground/50 mb-1">DAYS UNLOCKED</div>
              <div className="font-mono font-bold text-yellow-600 dark:text-yellow-500">
                {totalDaysUnlocked}/12
              </div>
            </div>
          </div>
          
          {/* Progress to Next Tier */}
          {!hasCompleteAccess && nextUnlock && (
            <div className="pt-4 border-t border-yellow-600/20 text-center">
              <div className="font-mono text-xs text-foreground/70 mb-2">
                Next Unlock: Day {nextUnlock.day}
              </div>
              <div className="font-mono text-sm font-bold text-orange-600 dark:text-orange-400">
                {nextUnlock.formattedShortfall} {M00NYNAD_TOKEN.symbol} needed
              </div>
            </div>
          )}
          
          {hasCompleteAccess && (
            <div className="pt-4 border-t border-yellow-600/20 text-center">
              <div className="font-mono text-xs text-green-600 dark:text-green-400 font-bold">
                ✦ COMPLETE LUNAR ASCENSION ✦
              </div>
            </div>
          )}
        </div>
      </div>
      
      {children}
    </div>
  )
}

function getTierAsciiDisplay(tierConfig: any): string {
  // Truncate ASCII art to fit nicely
  const lines = tierConfig.asciiArt.split('\n')
  return lines.join('\n')
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

function formatShortfall(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}B`
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}K`
  }
  return amount.toFixed(0)
}