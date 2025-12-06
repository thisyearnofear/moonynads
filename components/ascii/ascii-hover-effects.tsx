'use client'

import { useState, useRef } from 'react'
import { useEasterEggs } from '@/hooks/ui/use-easter-eggs'

interface ASCIIHoverEffectsProps {
  children: React.ReactNode
  asciiId?: string
}

export function ASCIIHoverEffects({ children, asciiId }: ASCIIHoverEffectsProps) {
  const [isShiftHeld, setIsShiftHeld] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const { unlockSecret, isSecretUnlocked } = useEasterEggs()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    // Check if shift is being held
    const checkShift = (e: KeyboardEvent) => {
      setIsShiftHeld(e.shiftKey)
    }
    
    window.addEventListener('keydown', checkShift)
    window.addEventListener('keyup', checkShift)
    
    return () => {
      window.removeEventListener('keydown', checkShift)
      window.removeEventListener('keyup', checkShift)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isShiftHeld) {
      e.preventDefault()
      unlockSecret('shift-click')
      setShowSecret(true)
      
      // Add matrix effect
      if (containerRef.current) {
        containerRef.current.style.animation = 'matrix-glow 2s ease-in-out'
      }
      
      setTimeout(() => setShowSecret(false), 3000)
    }
  }

  const handleTripleClick = () => {
    // Secret triple-click Easter egg
    unlockSecret('triple-click')
    
    // Create sparkle effect
    if (containerRef.current) {
      const sparkles = document.createElement('div')
      sparkles.innerHTML = '✨'.repeat(8)
      sparkles.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        animation: sparkleExplode 1.5s ease-out forwards;
        pointer-events: none;
        z-index: 10;
      `
      
      const sparkleStyle = document.createElement('style')
      sparkleStyle.textContent = `
        @keyframes sparkleExplode {
          0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.5) rotate(180deg); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(2) rotate(360deg); opacity: 0; }
        }
        @keyframes matrix-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.8), inset 0 0 10px rgba(34, 197, 94, 0.2); }
        }
      `
      
      document.head.appendChild(sparkleStyle)
      containerRef.current.appendChild(sparkles)
      
      setTimeout(() => {
        containerRef.current?.removeChild(sparkles)
        document.head.removeChild(sparkleStyle)
      }, 1500)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`
        relative
        transition-all 
        duration-300
        ${isShiftHeld ? 'ring-2 ring-green-500 ring-opacity-50' : ''}
        ${isSecretUnlocked('shift-click') ? 'hover:shadow-lg hover:shadow-green-500/20' : ''}
      `}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      onDoubleClick={(e) => {
        if (e.detail === 3) handleTripleClick() // Detect triple click
      }}
      title={isShiftHeld ? "🔓 Shift+Click for secret!" : "Hold SHIFT and click for a surprise"}
    >
      {children}
      
      {/* Secret overlay */}
      {showSecret && (
        <div className="absolute inset-0 bg-green-900/80 flex items-center justify-center rounded-lg">
          <div className="text-center text-green-300 font-mono">
            <div className="text-2xl mb-2">🔓</div>
            <div className="text-sm">Secret ASCII Mode</div>
            <div className="text-xs opacity-70">You found the hidden layer!</div>
          </div>
        </div>
      )}
      
      {/* Shift indicator */}
      {isShiftHeld && (
        <div className="absolute top-2 right-2 text-xs bg-green-900 text-green-300 px-2 py-1 rounded font-mono">
          SHIFT
        </div>
      )}
    </div>
  )
}