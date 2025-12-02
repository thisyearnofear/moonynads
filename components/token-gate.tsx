'use client'

import { useAccount } from 'wagmi'
import { useTokenBalance } from '@/hooks/use-token-balance'
import { M00NYNAD_TOKEN, CONFIG } from '@/lib/blockchain'
import { WalletConnect } from './wallet-connect'

interface TokenGateProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requiredAmount?: number
}

export function TokenGate({ children, fallback, requiredAmount = 250_000_000 }: TokenGateProps) {
  const { address, isConnected } = useAccount()
  const { balance, hasRequiredBalance, isLoading, formatted } = useTokenBalance(address)

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
  if (!hasRequiredBalance) {
    const shortfall = requiredAmount - balance
    
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-6xl mb-4">🪙</div>
          <h3 className="text-xl font-mono font-bold text-yellow-700 dark:text-yellow-500">
            Insufficient Token Balance
          </h3>
          <div className="space-y-2 text-sm text-foreground/70">
            <p>
              You have <span className="font-mono text-yellow-600">{formatted} {M00NYNAD_TOKEN.symbol}</span>
            </p>
            <p>
              Need <span className="font-mono text-yellow-600">{formatShortfall(shortfall)} more</span> to view the complete collection
            </p>
          </div>
          <p className="text-xs text-foreground/50">
            Each piece becomes viewable when you reach the 250M balance before its advent day launch.
          </p>
          <div className="pt-4 border-t border-yellow-600/20 space-y-2">
            <a
              href={`${CONFIG.network.explorer}/address/${M00NYNAD_TOKEN.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-yellow-600 hover:text-yellow-500 transition-colors font-mono"
            >
              Buy {M00NYNAD_TOKEN.symbol} Tokens ↗
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

  // If user has sufficient balance, show the gated content
  return (
    <div>
      {/* Token Holder Badge */}
      <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-green-50 dark:from-yellow-950/20 dark:to-green-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl">💎</span>
          <div>
            <div className="font-mono text-sm font-bold text-yellow-700 dark:text-yellow-500">
              Premium Token Holder
            </div>
            <div className="font-mono text-xs text-green-600 dark:text-green-400">
              {formatted} {M00NYNAD_TOKEN.symbol} • Complete Access Unlocked
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
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