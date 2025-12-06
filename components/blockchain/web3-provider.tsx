'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '@/lib/wagmi'
import { useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AutoConnect />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function AutoConnect() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const { sdk } = await import('@farcaster/miniapp-sdk')
        const caps = await sdk.getCapabilities()
        const supportsWallet = Array.isArray(caps) && caps.includes('wallet.getEthereumProvider')
        if (!isConnected && supportsWallet) {
          const far = connectors.find(c => (c as any).id?.includes('farcaster') || c.name.toLowerCase().includes('farcaster')) || connectors[0]
          if (far && !cancelled) {
            await connect({ connector: far })
          }
        }
      } catch {}
    }
    run()
    return () => {
      cancelled = true
    }
  }, [isConnected, connect, connectors])

  return null
}
