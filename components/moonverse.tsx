'use client'

import { M00NYNAD_TOKEN } from '@/lib/blockchain'

interface MoonverseApp {
  name: string
  description: string
  url: string
  creator: string
  creatorProfile: string
  category: 'App' | 'Tool' | 'Community' | 'Game'
  status: 'Live' | 'Beta' | 'Coming Soon'
  icon: string
}

const MOONVERSE_APPS: MoonverseApp[] = [
  {
    name: 'm00n.app',
    description: 'Another lunar landing game experience for the m00nad community',
    url: 'https://m00n.app',
    creator: 'horsefacts.eth',
    creatorProfile: 'https://farcaster.xyz/horsefacts.eth/0xc8c330d9',
    category: 'Game',
    status: 'Live',
    icon: '🌙'
  },
  {
    name: 'M00nlander',
    description: 'Interactive lunar landing game for m00nad holders',
    url: 'https://m00nlander.netlify.app/',
    creator: 'papa',
    creatorProfile: 'https://farcaster.xyz/papa/0x4324a8f6',
    category: 'Game',
    status: 'Live',
    icon: '🚀'
  },
  {
    name: 'M00nCabal Check',
    description: 'Verify your membership in the exclusive m00nad cabal',
    url: 'https://farcaster.xyz/miniapps/biCLcq0erWpR/m00nad-cabal-check',
    creator: 'm00npapi.eth',
    creatorProfile: 'https://farcaster.xyz/m00npapi.eth/0x8a7d234c',
    category: 'Tool',
    status: 'Live',
    icon: '🔍'
  },
  {
    name: 'Moonynads Gallery',
    description: 'Token-gated ASCII art NFT collection and advent calendar',
    url: 'https://m00nynads.vercel.app',
    creator: 'Moonynads Team',
    creatorProfile: '#',
    category: 'App',
    status: 'Live',
    icon: '🎨'
  }
]

export function Moonverse() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30'
      case 'Beta': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30'
      case 'Coming Soon': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30'
      default: return 'text-foreground/60'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'App': return 'text-purple-600 dark:text-purple-400'
      case 'Tool': return 'text-blue-600 dark:text-blue-400'
      case 'Community': return 'text-yellow-600 dark:text-yellow-400'
      case 'Game': return 'text-red-600 dark:text-red-400'
      default: return 'text-foreground/60'
    }
  }

  return (
    <section className="py-12" data-moonverse>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-mono text-yellow-700 dark:text-yellow-500 mb-4">
            🌌 MOONVERSE
          </h2>
          <p className="text-sm text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Discover the growing ecosystem of apps, tools, and experiences built around the{' '}
            <span className="font-mono text-yellow-600">{M00NYNAD_TOKEN.symbol}</span> memetoken.
            Join the lunar revolution and explore what the community is building!
          </p>
        </div>

        {/* Apps Grid - 2x2 layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
          {MOONVERSE_APPS.map((app, index) => (
            <div
              key={app.name}
              className="group bg-card border border-yellow-600/20 hover:border-yellow-600/50 rounded-lg p-6 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/10"
            >
              {/* App Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{app.icon}</div>
                <div className="flex flex-col gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  <span className={`text-xs font-mono ${getCategoryColor(app.category)}`}>
                    {app.category}
                  </span>
                </div>
              </div>

              {/* App Info */}
              <div className="mb-4">
                <h3 className="font-mono text-lg font-bold text-yellow-700 dark:text-yellow-500 mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                  {app.name}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">
                  {app.description}
                </p>
              </div>

              {/* Creator */}
              <div className="mb-4 pb-4 border-b border-yellow-600/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-foreground/50">by</span>
                  {app.creatorProfile !== '#' ? (
                    <a
                      href={app.creatorProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-yellow-600 hover:text-yellow-500 transition-colors"
                    >
                      {app.creator} ↗
                    </a>
                  ) : (
                    <span className="font-mono text-xs text-yellow-600">
                      {app.creator}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <a
                href={app.url}
                target={app.url.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-mono rounded transition-colors"
              >
                {app.status === 'Coming Soon' ? 'Learn More' : 'Launch App'}
              </a>
            </div>
          ))}
        </div>

        {/* Community CTA */}
        <div className="text-center py-8 border-t border-yellow-600/20">
          <h3 className="font-mono text-lg font-bold text-yellow-700 dark:text-yellow-500 mb-4">
            Building in the Moonverse?
          </h3>
          <p className="text-sm text-foreground/70 mb-6 max-w-lg mx-auto">
            Join the growing ecosystem of builders creating innovative experiences around{' '}
            <span className="font-mono text-yellow-600">{M00NYNAD_TOKEN.symbol}</span>.
            Share your project and connect with the community!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://farcaster.xyz/~/code/YKR2G8`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-mono rounded transition-colors"
            >
              💜 Join Farcaster
            </a>
            
            <a
              href={`https://x.com/m00npapi`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 border border-yellow-600 hover:bg-yellow-600 hover:text-white text-yellow-600 text-sm font-mono rounded transition-colors"
            >
              🐦 Follow Creator
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}