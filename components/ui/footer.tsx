'use client'

import { useState, useEffect } from 'react'
import { CONFIG, M00NYNAD_TOKEN } from '@/lib/blockchain'
import { isDemoModeActive } from '@/lib/demo-mode'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [showTokenomics, setShowTokenomics] = useState(false)
  const [judgeMode, setJudgeMode] = useState(false)
  
  useEffect(() => {
    setJudgeMode(isDemoModeActive())
  }, [])

  return (
    <footer className="border-t border-yellow-600/20 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        {/* Tokenomics info - hidden by default, revealed on hover/click */}
        {showTokenomics && (
          <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded text-xs font-mono text-yellow-700 dark:text-yellow-300 leading-relaxed">
            <div className="font-bold mb-2">💰 Sales Distribution</div>
            <div>80% burned • 10% platform • 10% airdrops</div>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-foreground/60 font-mono">
          
          {/* Left side - Copyright and branding */}
          <div className="flex items-center gap-4">
            <span>© {currentYear} Moonynads</span>
            <span className="text-yellow-600/30">•</span>
            <span>ASCII Art on Monad</span>
          </div>
          
          {/* Right side - Links */}
          <div className="flex items-center gap-4 text-yellow-600">
            <a
              href={`${CONFIG.network.explorer}/address/${M00NYNAD_TOKEN.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-500 transition-colors"
              title="m00nynad token"
            >
              {M00NYNAD_TOKEN.symbol}
            </a>
            <span className="text-yellow-600/30">•</span>
            <a
              href={CONFIG.network.explorer}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-500 transition-colors"
            >
              MonadVision
            </a>
            <span className="text-yellow-600/30">•</span>
            <button
              onClick={() => setShowTokenomics(!showTokenomics)}
              className="hover:text-yellow-500 transition-colors cursor-pointer"
              title="View tokenomics"
            >
              Chain {CONFIG.network.chainId}
            </button>
            {judgeMode && (
              <>
                <span className="text-yellow-600/30">•</span>
                <span 
                  className="text-yellow-600/50 hover:text-yellow-500 transition-colors cursor-help"
                  title="Judge Mode Active - Full access enabled"
                >
                  🎃
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}