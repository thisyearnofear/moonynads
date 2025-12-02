'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEasterEggs } from '@/hooks/use-easter-eggs'

export default function SecretMoonPage() {
  const [timeSpent, setTimeSpent] = useState(0)
  const [showUltimateSecret, setShowUltimateSecret] = useState(false)
  const { unlockSecret, secretsUnlocked, isSecretUnlocked } = useEasterEggs()
  const router = useRouter()

  // Unlock the "secret-page" achievement
  useEffect(() => {
    unlockSecret('secret-page')
  }, [unlockSecret])

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Ultimate secret after 30 seconds
  useEffect(() => {
    if (timeSpent === 30) {
      setShowUltimateSecret(true)
      unlockSecret('patience')
    }
  }, [timeSpent, unlockSecret])

  const secretQuotes = [
    "The moon doesn't ask the sun for permission to shine. 🌙",
    "In the crypto winter, hodlers are forged like diamonds. 💎",
    "Every monad contains infinite possibilities. ∞",
    "ASCII art is the purest form of digital expression. 🎨",
    "m00nynad holders are the true lunar architects. 🏗️"
  ]

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-8">
      {/* Matrix-style header */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4 animate-pulse">🌙</div>
        <h1 className="text-3xl font-bold mb-2">WELCOME TO THE SECRET MOON</h1>
        <div className="text-sm opacity-70">Well well... look who found the back entrance 😏</div>
      </div>

      {/* Secret stats */}
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-green-950/50 border border-green-700 rounded p-4">
            <div className="text-2xl font-bold">{secretsUnlocked.length}/5</div>
            <div className="text-xs opacity-70">Secrets Found</div>
          </div>
          <div className="bg-green-950/50 border border-green-700 rounded p-4">
            <div className="text-2xl font-bold">{timeSpent}s</div>
            <div className="text-xs opacity-70">Time Exploring</div>
          </div>
        </div>

        {/* ASCII Art Gallery */}
        <div className="bg-green-950/30 border border-green-700 rounded p-6">
          <h2 className="text-xl font-bold mb-4 text-center">CLASSIFIED INTEL</h2>
          <div className="space-y-4 text-sm">
            {secretsUnlocked.includes('konami') && (
              <div className="p-3 bg-green-900/30 rounded">
                🎮 <strong>Konami Master:</strong> You've got the moves like Jagger
              </div>
            )}
            {secretsUnlocked.includes('console') && (
              <div className="p-3 bg-green-900/30 rounded">
                💻 <strong>Backdoor Specialist:</strong> Always finding the rear entrance
              </div>
            )}
            {secretsUnlocked.includes('moon-clicks') && (
              <div className="p-3 bg-green-900/30 rounded">
                🌙 <strong>Moon Fondler:</strong> Can't keep your hands off the goods
              </div>
            )}
            {secretsUnlocked.includes('shift-click') && (
              <div className="p-3 bg-green-900/30 rounded">
                🔓 <strong>Peeping Tom:</strong> Always looking for what's underneath
              </div>
            )}
            {secretsUnlocked.includes('secret-page') && (
              <div className="p-3 bg-green-900/30 rounded">
                🗂️ <strong>Bottom Feeder:</strong> Dug deep to find the good stuff
              </div>
            )}
          </div>
        </div>

        {/* Wisdom section */}
        <div className="bg-green-950/30 border border-green-700 rounded p-6">
          <h3 className="text-lg font-bold mb-4">🧙‍♂️ MOON WISDOM</h3>
          <div className="text-sm italic">
            "{secretQuotes[secretsUnlocked.length - 1] || secretQuotes[0]}"
          </div>
        </div>

        {/* Ultimate secret */}
        {showUltimateSecret && (
          <div className="bg-gradient-to-r from-yellow-900 to-green-900 border-2 border-yellow-400 rounded p-6 text-center animate-pulse">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">ULTIMATE SECRET UNLOCKED</h3>
            <div className="text-sm text-yellow-200 mb-4">
              Your patience has been rewarded. You are now a Guardian of the Moon.
            </div>
            <div className="text-xs font-mono bg-black/50 p-2 rounded">
              Contract: 0x22cd99ec337a2811f594340a4a6e41e4a3022b07<br/>
              Builder: True Moonynads Explorer<br/>
              Status: ✅ VERIFIED HUMAN
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="text-center space-y-4">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-green-800 hover:bg-green-700 rounded transition-colors"
          >
            Return to Surface
          </button>
          
          <div className="text-xs opacity-50">
            Continue exploring to unlock more secrets...
          </div>
        </div>
      </div>

      {/* Background matrix effect */}
      <div className="fixed inset-0 pointer-events-none opacity-5 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-xs animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            🌙
          </div>
        ))}
      </div>
    </div>
  )
}