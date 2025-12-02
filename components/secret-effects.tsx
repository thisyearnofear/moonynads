'use client'

import { useEffect, useState } from 'react'
import { useEasterEggs } from '@/hooks/use-easter-eggs'

export function SecretEffects() {
  const { secretsUnlocked, isSecretUnlocked } = useEasterEggs()
  const [showFloatingMoons, setShowFloatingMoons] = useState(false)

  // Floating moons effect for Konami unlock
  useEffect(() => {
    if (isSecretUnlocked('konami')) {
      setShowFloatingMoons(true)
      const timer = setTimeout(() => setShowFloatingMoons(false), 10000)
      return () => clearTimeout(timer)
    }
  }, [isSecretUnlocked])

  // Secret message overlay
  const showSecretOverlay = isSecretUnlocked('console') && secretsUnlocked.length >= 2

  return (
    <>
      {/* Floating Moons Effect */}
      {showFloatingMoons && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              🌙
            </div>
          ))}
        </div>
      )}

      {/* Secret Achievement Overlay */}
      {showSecretOverlay && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => {/* Can be closed by clicking */}}
        >
          <div className="bg-gradient-to-br from-yellow-900 to-yellow-950 border-2 border-yellow-400 rounded-xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">🏆</div>
            <div className="font-mono text-xl font-bold text-yellow-400 mb-4">
              EASTER EGG MASTER
            </div>
            <div className="text-sm text-yellow-200 mb-6 leading-relaxed">
              You've discovered {secretsUnlocked.length} secrets! 
              You're now part of the inner circle of moon explorers. 🌙
            </div>
            <div className="text-xs text-yellow-300 font-mono">
              Secret Collector Badge Unlocked
            </div>
          </div>
        </div>
      )}

      {/* Persistent Secret Counter */}
      {secretsUnlocked.length > 0 && (
        <div className="fixed bottom-4 left-4 z-40">
          <div className="bg-yellow-900/90 border border-yellow-600 rounded-full px-3 py-1 text-xs font-mono text-yellow-300">
            🥚 {secretsUnlocked.length}/5
          </div>
        </div>
      )}
    </>
  )
}