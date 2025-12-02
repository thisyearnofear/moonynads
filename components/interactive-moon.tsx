'use client'

import { useEasterEggs } from '@/hooks/use-easter-eggs'
import { useState } from 'react'

interface InteractiveMoonProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function InteractiveMoon({ className = '', size = 'md' }: InteractiveMoonProps) {
  const { handleMoonClick, moonClickCount, isSecretUnlocked } = useEasterEggs()
  const [isAnimating, setIsAnimating] = useState(false)

  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl', 
    lg: 'text-6xl'
  }

  const handleClick = () => {
    handleMoonClick()
    setIsAnimating(true)
    
    // Reset animation
    setTimeout(() => setIsAnimating(false), 300)
    
    // Special effect at 5 clicks (halfway point)
    if (moonClickCount === 5) {
      // Pulse effect
      const pulseStyle = document.createElement('style')
      pulseStyle.textContent = `
        @keyframes moonPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); filter: brightness(1.5); }
          100% { transform: scale(1); }
        }
      `
      document.head.appendChild(pulseStyle)
      
      // Clean up
      setTimeout(() => document.head.removeChild(pulseStyle), 1000)
    }
  }

  const handleDoubleClick = () => {
    // Easter egg: double click reveals contract address
    navigator.clipboard.writeText('0x22cd99ec337a2811f594340a4a6e41e4a3022b07')
    
    // Show copied notification
    const notification = document.createElement('div')
    notification.innerHTML = '📋 Contract address copied!'
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(234, 179, 8, 0.95);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-family: monospace;
      font-size: 12px;
      z-index: 9999;
    `
    
    document.body.appendChild(notification)
    setTimeout(() => document.body.removeChild(notification), 2000)
  }

  return (
    <span
      className={`
        ${sizeClasses[size]} 
        ${className}
        cursor-pointer 
        transition-all 
        duration-300 
        hover:scale-110 
        select-none
        ${isAnimating ? 'animate-spin' : ''}
        ${isSecretUnlocked('moon-clicks') ? 'filter brightness-125' : ''}
      `}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      title={`Click me! (${moonClickCount}/10)`}
      style={{
        animation: moonClickCount === 5 ? 'moonPulse 0.6s ease-in-out' : undefined
      }}
    >
      🌙
    </span>
  )
}