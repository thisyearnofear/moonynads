'use client'

import { useState } from 'react'
import { useChainId } from 'wagmi'
import { switchToMonadNetwork, CONFIG } from '@/lib/blockchain'

export function NetworkSwitcher() {
  const [isSwitching, setIsSwitching] = useState(false)
  const currentChainId = useChainId()
  const isOnMonad = currentChainId === CONFIG.network.chainId

  const handleSwitch = async () => {
    setIsSwitching(true)
    try {
      await switchToMonadNetwork()
    } catch (error) {
      console.error('Failed to switch network:', error)
    } finally {
      setIsSwitching(false)
    }
  }

  if (isOnMonad) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="font-mono text-green-600 dark:text-green-400">Monad Network</span>
      </div>
    )
  }

  return (
    <button
      onClick={handleSwitch}
      disabled={isSwitching}
      className="flex items-center gap-2 px-3 py-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white text-xs font-mono rounded transition-colors"
    >
      <div className="w-2 h-2 bg-orange-200 rounded-full animate-pulse"></div>
      {isSwitching ? 'Switching...' : 'Switch to Monad'}
    </button>
  )
}