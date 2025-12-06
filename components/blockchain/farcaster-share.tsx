'use client'

import { composeCast } from '@/lib/farcaster'

interface FarcasterShareProps {
  title?: string
  description?: string
  className?: string
}

export function FarcasterShare({ 
  title = "Moonynads - Lunar ASCII Art",
  description = "A token-gated collection of lunar ASCII art with a progressive 12-day advent calendar on Monad blockchain 🌙",
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
      title="Broadcast on Farcaster"
    >
      💜 Broadcast
    </button>
  )
}
