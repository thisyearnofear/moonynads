// Global type declarations for Web3

interface Window {
  ethereum?: {
    request: (args: {
      method: string
      params?: any[]
    }) => Promise<any>
    on?: (eventName: string, handler: (...args: any[]) => void) => void
    removeListener?: (eventName: string, handler: (...args: any[]) => void) => void
  }
}

// Extend the existing metadata interface for better type safety
interface TokenMetadata {
  name: string
  description: string
  image: string
  external_url: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  properties: {
    ascii_content: string
    category: string
    creator: string
    memetoken_address?: string
    [key: string]: unknown
  }
}