'use client'

import { useEffect } from 'react'
import { generateMiniAppEmbed } from '@/lib/miniapp-config'

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  // Note: sdk.actions.ready() is now called from page.tsx after content loads
  // This provider just handles injecting embed metadata

  useEffect(() => {
    // Inject Farcaster mini app embed meta tag for sharing (if not already in layout)
    if (!document.querySelector('meta[name="fc:miniapp"]')) {
      const miniappEmbed = generateMiniAppEmbed()
      const meta = document.createElement('meta')
      meta.setAttribute('name', 'fc:miniapp')
      meta.setAttribute('content', JSON.stringify(miniappEmbed))
      document.head.appendChild(meta)
    }
  }, [])

  return <>{children}</>
}
