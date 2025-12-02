'use client'

const CONFIG = {
  network: {
    chainId: 143,
    name: 'Monad Mainnet',
    currency: 'MON',
    rpc: 'https://rpc.monad.xyz',
    explorer: 'https://monadvision.com'
  },
  contract: { address: '0x0000000000000000000000000000000000000000' },
  advent: { startDay: 13, endDay: 24, mintPrice: '0.001', dailyLimit: 100 }
}

const M00NYNAD_TOKEN = {
  address: '0x22cd99ec337a2811f594340a4a6e41e4a3022b07',
  symbol: 'M00NYNAD'
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-yellow-600/20 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Project Info */}
          <div className="space-y-3">
            <h3 className="font-mono text-sm font-bold text-yellow-700 dark:text-yellow-500">
              🌙 MOONYNADS
            </h3>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Onchain ASCII art NFTs on Monad blockchain. Collect rare lunar-themed digital art 
              through our advent calendar and seasonal drops.
            </p>
            <div className="flex items-center gap-3">
              <div className="text-xs font-mono text-yellow-600">Web3 Coming Soon</div>
            </div>
          </div>

          {/* Network & Token Info */}
          <div className="space-y-3">
            <h3 className="font-mono text-sm font-bold text-yellow-700 dark:text-yellow-500">
              NETWORK & TOKEN
            </h3>
            <div className="space-y-2 text-xs text-foreground/70">
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="font-mono text-yellow-600">{CONFIG.network.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Chain ID:</span>
                <span className="font-mono text-yellow-600">{CONFIG.network.chainId}</span>
              </div>
              <div className="flex justify-between">
                <span>Currency:</span>
                <span className="font-mono text-yellow-600">{CONFIG.network.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Memetoken:</span>
                <a 
                  href={`${CONFIG.network.explorer}/address/${M00NYNAD_TOKEN.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-yellow-600 hover:text-yellow-500 transition-colors"
                  title="View m00nynad token contract"
                >
                  {M00NYNAD_TOKEN.symbol} ↗
                </a>
              </div>
              <div className="flex justify-between">
                <span>RPC:</span>
                <button
                  onClick={() => navigator.clipboard.writeText(CONFIG.network.rpc)}
                  className="font-mono text-yellow-600 hover:text-yellow-500 transition-colors text-left"
                  title="Click to copy RPC URL"
                >
                  {CONFIG.network.rpc.replace('https://', '')} 📋
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-mono text-sm font-bold text-yellow-700 dark:text-yellow-500">
              QUICK LINKS
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href={CONFIG.network.explorer}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-yellow-600 transition-colors"
              >
                MonadVision ↗
              </a>
              <a
                href="https://monadscan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-yellow-600 transition-colors"
              >
                MonadScan ↗
              </a>
              <a
                href="https://monad.socialscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-yellow-600 transition-colors"
              >
                SocialScan ↗
              </a>
              <a
                href="https://gmonads.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-yellow-600 transition-colors"
              >
                Network Viz ↗
              </a>
            </div>
          </div>
        </div>

        {/* Contract & Collection Info */}
        <div className="border-t border-yellow-600/10 pt-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-foreground/60">
            
            {/* Contract Details */}
            <div>
              <h4 className="font-mono text-xs font-bold text-yellow-600 mb-2">CONTRACT INFO</h4>
              <div className="space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>NFT Contract:</span>
                  <span className="text-yellow-600">
                    {CONFIG.contract.address.slice(0, 8)}...{CONFIG.contract.address.slice(-6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Mint Price:</span>
                  <span className="text-yellow-600">{CONFIG.advent.mintPrice} MON</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Limit:</span>
                  <span className="text-yellow-600">{CONFIG.advent.dailyLimit} mints</span>
                </div>
              </div>
            </div>

            {/* Collection Stats */}
            <div>
              <h4 className="font-mono text-xs font-bold text-yellow-600 mb-2">COLLECTION</h4>
              <div className="space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Advent Period:</span>
                  <span className="text-yellow-600">Dec 13-24</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Arts:</span>
                  <span className="text-yellow-600">13 unique pieces</span>
                </div>
                <div className="flex justify-between">
                  <span>Rarities:</span>
                  <span className="text-yellow-600">5 tiers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-yellow-600/10 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-foreground/50">
            <div className="flex items-center gap-4">
              <span className="font-mono">© {currentYear} Moonynads</span>
              <span className="hidden md:inline">•</span>
              <span className="font-mono">Built on Monad v0.12.2-rc</span>
            </div>
            
            <div className="flex items-center gap-4 font-mono">
              <span>Chain ID: {CONFIG.network.chainId}</span>
              <span>•</span>
              <span>ASCII Art NFTs</span>
              <span>•</span>
              <a
                href={`${CONFIG.network.explorer}/address/${M00NYNAD_TOKEN.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-600 hover:text-yellow-500 transition-colors"
                title="m00nynad token"
              >
                🪙 {M00NYNAD_TOKEN.symbol}
              </a>
              <span>•</span>
              <span className="text-yellow-600">🌙</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}