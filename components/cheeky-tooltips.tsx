'use client'

import { useState } from 'react'

interface CheekyTooltipProps {
  children: React.ReactNode
  message: string
  cheekyMessage?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function CheekyTooltip({ 
  children, 
  message, 
  cheekyMessage, 
  position = 'top' 
}: CheekyTooltipProps) {
  const [showCheeky, setShowCheeky] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Show cheeky message after 3 seconds of hovering
  let hoverTimer: NodeJS.Timeout

  const handleMouseEnter = () => {
    setShowTooltip(true)
    if (cheekyMessage) {
      hoverTimer = setTimeout(() => {
        setShowCheeky(true)
      }, 3000)
    }
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
    setShowCheeky(false)
    clearTimeout(hoverTimer)
  }

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2', 
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {showTooltip && (
        <div className={`
          absolute z-50 px-3 py-2 text-xs font-mono
          bg-black text-white rounded shadow-lg whitespace-nowrap
          ${positionClasses[position]}
          ${showCheeky ? 'bg-yellow-900 text-yellow-100' : ''}
          transition-all duration-300
        `}>
          {showCheeky && cheekyMessage ? cheekyMessage : message}
          {showCheeky && (
            <div className="absolute top-1 right-1 text-xs">😏</div>
          )}
        </div>
      )}
    </div>
  )
}

// Pre-built cheeky tooltips for common elements
export const CheekyTooltips = {
  Moon: (props: { children: React.ReactNode }) => (
    <CheekyTooltip 
      message="Click to interact with the moon"
      cheekyMessage="Getting handsy with the moon, are we? 😏"
      {...props}
    />
  ),
  
  Gallery: (props: { children: React.ReactNode }) => (
    <CheekyTooltip
      message="Browse the collection"
      cheekyMessage="Enjoying the view from behind? 🍑"
      {...props}
    />
  ),

  Mint: (props: { children: React.ReactNode }) => (
    <CheekyTooltip
      message="Mint your NFT"
      cheekyMessage="Time to make this relationship official! 💍"
      {...props}
    />
  ),

  Connect: (props: { children: React.ReactNode }) => (
    <CheekyTooltip
      message="Connect your wallet"
      cheekyMessage="Let's get intimate with those private keys... 🔑"
      {...props}
    />
  ),

  Rarity: (props: { children: React.ReactNode }) => (
    <CheekyTooltip
      message="View rarity information"
      cheekyMessage="Some positions are definitely rarer than others... 🎯"
      {...props}
    />
  )
}