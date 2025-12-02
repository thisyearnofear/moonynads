'use client'

import { composeCast } from '@/lib/farcaster'

interface FarcasterShareProps {
  title?: string
  description?: string
  className?: string
}

export function FarcasterShare({ 
  title = "Check out Moonynads",
  description = "A token-gated ASCII art NFT gallery with dynamic advent calendar mechanics on Monad blockchain 🌙",
  className = ""
}: FarcasterShareProps) {
  const handleShare = async () => {
    const text = `${title}\n\n${description}\n\nhttps://m00nynads.vercel.app`
    await composeCast(text)
  }

  return (
    <button
      onClick={handleShare}
      className={`font-mono text-xs px-3 py-1 border border-purple-600 hover:bg-purple-600 hover:text-white text-purple-600 dark:text-purple-400 dark:border-purple-400 rounded transition-colors ${className}`}
      title="Share on Farcaster"
    >
      💜 Share
    </button>
  )
}
