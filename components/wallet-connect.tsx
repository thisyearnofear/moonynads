'use client'

import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { CONFIG, switchToMonadNetwork } from '@/lib/blockchain'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const currentChainId = useChainId()
  const isOnWrongNetwork = isConnected && currentChainId !== CONFIG.network.chainId

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-950/50 px-2 py-1 rounded border">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        
        {isOnWrongNetwork ? (
          <button
            onClick={switchToMonadNetwork}
            className="font-mono text-xs px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
          >
            Switch to Monad
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-mono text-xs text-green-600 dark:text-green-400">Monad</span>
          </div>
        )}
        
        <button
          onClick={() => disconnect()}
          className="font-mono text-xs px-2 py-1 border border-yellow-600/30 hover:border-yellow-600/70 rounded transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      disabled={isPending}
      className="font-mono text-xs px-3 py-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white rounded transition-colors"
    >
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
}