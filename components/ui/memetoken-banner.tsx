'use client'

import { M00NYNAD_TOKEN, CONFIG } from '@/lib/blockchain'

export function MemetokenBanner() {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-y border-yellow-200 dark:border-yellow-800/30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪙</span>
            <span className="font-mono text-sm font-bold text-yellow-700 dark:text-yellow-500">
              Powered by {M00NYNAD_TOKEN.symbol}
            </span>
          </div>
          
          <div className="hidden sm:block w-px h-6 bg-yellow-300 dark:bg-yellow-700"></div>
          
          <div className="flex items-center gap-4 text-xs text-yellow-600 dark:text-yellow-400">
            <a
              href={`${CONFIG.network.explorer}/address/${M00NYNAD_TOKEN.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-500 transition-colors font-mono"
            >
              View Token Contract ↗
            </a>
            
            <span>•</span>
            
            <span className="font-mono">
              {M00NYNAD_TOKEN.address.slice(0, 8)}...{M00NYNAD_TOKEN.address.slice(-6)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}