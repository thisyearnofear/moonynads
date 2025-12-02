'use client'

import { useEffect } from 'react'
import { initFarcasterSDK } from '@/lib/farcaster'

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Farcaster SDK if running in Farcaster context
    initFarcasterSDK().catch(err => {
      console.log('Farcaster SDK not available (running in browser context)')
    })

    // Add Farcaster mini app embed meta tag
    const miniappEmbed = {
      version: '1',
      imageUrl: 'https://m00nynads.vercel.app/og-image.png',
      button: {
        title: '🌙 View Gallery',
        action: {
          type: 'launch_frame',
          name: 'Moonynads',
          url: 'https://m00nynads.vercel.app',
          splashImageUrl: 'https://m00nynads.vercel.app/icon.svg',
          splashBackgroundColor: '#0a0a0b'
        }
      }
    }

    // Inject meta tag if it doesn't exist
    if (!document.querySelector('meta[property="fc:miniapp"]')) {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'fc:miniapp')
      meta.setAttribute('content', JSON.stringify(miniappEmbed))
      document.head.appendChild(meta)
    }
  }, [])

  return <>{children}</>
}
