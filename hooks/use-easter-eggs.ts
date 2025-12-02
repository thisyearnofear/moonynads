'use client'

import { useState, useEffect, useCallback } from 'react'

export function useEasterEggs() {
  const [konamiSequence, setKonamiSequence] = useState<string[]>([])
  const [moonClickCount, setMoonClickCount] = useState(0)
  const [secretsUnlocked, setSecretsUnlocked] = useState<string[]>([])
  const [showSecretMessage, setShowSecretMessage] = useState(false)

  // Konami Code: ↑↑↓↓←→←→BA
  const KONAMI_CODE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ]

  // Handle Konami Code
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKonamiSequence(prev => {
        const newSequence = [...prev, event.code].slice(-KONAMI_CODE.length)
        
        if (newSequence.length === KONAMI_CODE.length && 
            newSequence.every((key, index) => key === KONAMI_CODE[index])) {
          unlockSecret('konami')
          triggerKonamiEffect()
          return []
        }
        
        return newSequence
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Console Easter Egg
  useEffect(() => {
    console.log(`
    🌙 M O O N Y N A D S 🌙
    
         ___..._
        /   \\   \\    
       |  O   O   |   
       |     >    |   
        \\   ___  /    
         \\  \\_/  /     
          \\_____/      
    
    🍑 Well hello there, cheeky explorer!
    
    Looking for some behind-the-scenes action?
    • Konami Code (↑↑↓↓←→←→BA) - Classic moves
    • Click the moon 10 times - Get handsy with it
    • Type "gmMoon()" - Developer backdoor access
    • SHIFT+Click ASCII art - See what's underneath  
    • Click "Chain ..." in footer - View tokenomics
    • Visit /secret-moon - For the truly committed
    
    💰 Sales: 80% burned, 10% platform, 10% airdrops
    🪙 m00nynad contract: ${typeof window !== 'undefined' ? '0x22cd99ec337a2811f594340a4a6e41e4a3022b07' : 'Loading...'}
    
    Built with 💚 (and a sense of humor) for the Moonverse
    Remember: Stay cheeky, but keep it classy! 😉
    `)

    // Listen for console commands
    ;(window as any).gmMoon = () => {
      unlockSecret('console')
      console.log('🎉 Secret unlocked! You found the console easter egg!')
      setShowSecretMessage(true)
    }
  }, [])

  const unlockSecret = useCallback((secretId: string) => {
    setSecretsUnlocked(prev => {
      if (!prev.includes(secretId)) {
        const newSecrets = [...prev, secretId]
        
        // Store in localStorage
        localStorage.setItem('moonynads-secrets', JSON.stringify(newSecrets))
        
        // Show celebration
        triggerSecretUnlock(secretId)
        
        return newSecrets
      }
      return prev
    })
  }, [])

  const handleMoonClick = useCallback(() => {
    setMoonClickCount(prev => {
      const newCount = prev + 1
      
      if (newCount === 10) {
        unlockSecret('moon-clicks')
        return 0 // Reset counter
      }
      
      return newCount
    })
  }, [unlockSecret])

  const triggerKonamiEffect = () => {
    // Create rainbow effect
    document.body.style.animation = 'rainbow-bg 2s ease-in-out'
    
    // Add temporary CSS
    const style = document.createElement('style')
    style.textContent = `
      @keyframes rainbow-bg {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `
    document.head.appendChild(style)
    
    // Clean up after animation
    setTimeout(() => {
      document.body.style.animation = ''
      document.head.removeChild(style)
    }, 2000)
  }

  const triggerSecretUnlock = (secretId: string) => {
    // Create floating notification
    const notification = document.createElement('div')
    notification.innerHTML = '🥚 Secret Unlocked!'
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #eab308, #f59e0b);
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      font-family: monospace;
      font-weight: bold;
      z-index: 9999;
      animation: slideInBounce 0.5s ease-out;
      box-shadow: 0 4px 20px rgba(234, 179, 8, 0.3);
    `
    
    // Add animation
    const animationStyle = document.createElement('style')
    animationStyle.textContent = `
      @keyframes slideInBounce {
        0% { transform: translateX(100%) scale(0.8); opacity: 0; }
        60% { transform: translateX(-10px) scale(1.1); }
        100% { transform: translateX(0) scale(1); opacity: 1; }
      }
    `
    document.head.appendChild(animationStyle)
    
    document.body.appendChild(notification)
    
    // Remove after delay
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in forwards'
      setTimeout(() => {
        document.body.removeChild(notification)
        document.head.removeChild(animationStyle)
      }, 300)
    }, 3000)
    
    // Add slideOut animation
    setTimeout(() => {
      const slideOutStyle = document.createElement('style')
      slideOutStyle.textContent = `
        @keyframes slideOut {
          to { transform: translateX(100%); opacity: 0; }
        }
      `
      document.head.appendChild(slideOutStyle)
    }, 100)
  }

  // Load secrets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('moonynads-secrets')
    if (saved) {
      setSecretsUnlocked(JSON.parse(saved))
    }
  }, [])

  return {
    secretsUnlocked,
    moonClickCount,
    showSecretMessage,
    handleMoonClick,
    unlockSecret,
    isSecretUnlocked: (secretId: string) => secretsUnlocked.includes(secretId)
  }
}