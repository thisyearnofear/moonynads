'use client'

import { useEffect } from 'react'
import { generateMiniAppEmbed } from '@/lib/miniapp-config'

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Call sdk.actions.ready() when the app is ready to display
    // This hides the splash screen and tells Farcaster the mini app is loaded
    const initFarcaster = async () => {
      try {
        const { sdk } = await import('@farcaster/miniapp-sdk')
        // Call ready after app loads - will be called after content is rendered
        await sdk.actions.ready()
        console.log('Farcaster SDK ready called')
      } catch (error) {
        // Not running in Farcaster context, which is fine for local testing
        console.log('Farcaster SDK not available (running in browser context)', error)
      }
    }

    // Wait longer for content to load before calling ready()
    // Use requestIdleCallback for better timing, or fallback to longer timeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => initFarcaster(), { timeout: 3000 })
    } else {
      const timer = setTimeout(initFarcaster, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

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
