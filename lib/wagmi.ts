import { http, createConfig } from 'wagmi'
import { defineChain } from 'viem'
import { CONFIG } from './contracts'

const monad = defineChain({
  id: CONFIG.network.chainId,
  name: CONFIG.network.name,
  nativeCurrency: { decimals: 18, name: CONFIG.network.currency, symbol: CONFIG.network.currency },
  rpcUrls: { default: { http: [CONFIG.network.rpc] } },
  blockExplorers: { default: { name: 'MonadVision', url: CONFIG.network.explorer } },
  contracts: { multicall3: { address: '0xcA11bde05977b3631167028862bE2a173976CA11' } }
})

export const config = createConfig({
  chains: [monad],
  transports: { [monad.id]: http(CONFIG.network.rpc) },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}