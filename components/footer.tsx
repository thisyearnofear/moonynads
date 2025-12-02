'use client'

import { CONFIG, M00NYNAD_TOKEN } from '@/lib/blockchain'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-yellow-600/20 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
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
            <span>Chain {CONFIG.network.chainId}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}