"use client"

import { useState, useEffect } from "react"

interface ArtPiece {
  id: string
  name: string
  content: string
  description: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
}

interface AdventCalendarProps {
  artPieces: ArtPiece[]
  currentDate: Date
  onModalStateChange?: (isOpen: boolean) => void
}

export default function AdventCalendar({ artPieces, currentDate, onModalStateChange }: AdventCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [unlockedDays, setUnlockedDays] = useState<number[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  
  // In development, allow all days to be clickable
  const isDevelopment = typeof window !== 'undefined' && process.env.NODE_ENV === 'development'

  // Calculate which days should be unlocked based on current date
  const currentDayOfMonth = currentDate.getDate()
  const currentMonth = currentDate.getMonth() // 11 = December

  // For December, unlock days 1 through current day (up to day 24)
  // In development, allow all days
  const availableDays = isDevelopment ? 24 : (currentMonth === 11 ? Math.min(currentDayOfMonth, 24) : 0)

  // Mint campaign starts on the 19th (six days: 19–24)
  const adventDays = Array.from({ length: 6 }, (_, i) => i + 19)

  const handleDayClick = (day: number) => {
    if (day <= availableDays) {
      setSelectedDay(day)
      // Mark as unlocked if not already
      if (!unlockedDays.includes(day)) {
        setUnlockedDays([...unlockedDays, day])
        setShowConfetti(true)
        // Hide confetti after animation
        setTimeout(() => setShowConfetti(false), 2000)
      }
    }
  }

  const handleCloseModal = () => {
    setSelectedDay(null)
    onModalStateChange?.(false)
  }
  
  // Notify parent when modal opens
  useEffect(() => {
    onModalStateChange?.(selectedDay !== null)
  }, [selectedDay, onModalStateChange])

  // Map days to specific art pieces
  const dayToArtMap: Record<number, number> = {
    13: 0,   // moon
    14: 1,   // moon2
    15: 2,   // moon3
    16: 3,   // heart
    17: 4,   // lady
    18: 5,   // chudnovsky
    19: 6,   // headupbutt
    20: 7,   // hips
    21: 8,   // l
    22: 9,   // m
    23: 10,  // multi
    24: 11   // s
  }

  // Subtle mechanics hints for each day
  const dayMechanicsHints: Record<number, { emoji: string; hint: string }> = {
    13: { emoji: '⚡', hint: 'First come, first served' },
    14: { emoji: '📉', hint: 'Price discovery mode' },
    15: { emoji: '🎰', hint: 'Randomness awaits' },
    16: { emoji: '🎮', hint: 'Leaderboard mechanics' },
    17: { emoji: '📱', hint: 'Social engagement bonus' },
    18: { emoji: '🏆', hint: 'Competitive bidding' },
    19: { emoji: '🤝', hint: 'Community challenge' },
    20: { emoji: '⭐', hint: 'Creator recognition' },
    21: { emoji: '💎', hint: 'Exclusive tier' },
    22: { emoji: '🎁', hint: 'Mystery revealed' },
    23: { emoji: '🌊', hint: 'Unlimited opportunity' },
    24: { emoji: '🌙', hint: 'Finale celebration' }
  }

  const getMintCount = (day: number): number => {
    return day >= 19 ? 2 : 1
  }

  const getArtForDay = (day: number, mintIndex: number = 0): ArtPiece | null => {
    if (!artPieces.length) return null
    const baseIndex = dayToArtMap[day] ?? day % artPieces.length
    const index = (baseIndex + (day >= 19 ? mintIndex : 0)) % artPieces.length
    return artPieces[index]
  }

  const selectedArtPrimary = selectedDay ? getArtForDay(selectedDay, 0) : null
  const selectedArtSecondary = selectedDay && getMintCount(selectedDay) > 1 ? getArtForDay(selectedDay, 1) : null
  
  // Debug logging in development
  if (typeof window !== 'undefined' && isDevelopment) {
    if (selectedDay && !selectedArtPrimary) {
      console.warn(`No primary art found for day ${selectedDay}. Art pieces available:`, artPieces.length)
    }
    if (selectedDay && getMintCount(selectedDay) > 1 && !selectedArtSecondary) {
      console.warn(`No secondary art found for day ${selectedDay}. Art pieces available:`, artPieces.length)
    }
  }

  // Rarity colors
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-muted-foreground'
      case 'uncommon': return 'text-accent'
      case 'rare': return 'text-primary'
      case 'epic': return 'text-destructive'
      case 'legendary': return 'text-[#FFD700]'
      default: return 'text-foreground'
    }
  }

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animation: `confetti-fall 2s ease-out forwards`,
                animationDelay: `${i * 40}ms`,
                background: ['#d4af37', '#ffd700', '#ffed4e', '#eab308', '#fbbf24'][Math.floor(Math.random() * 5)],
                width: '6px',
                height: '6px',
                borderRadius: '50%'
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(600px) translateX(${(Math.random() - 0.5) * 150}px) rotate(720deg);
          }
        }
      `}</style>

      <div className="space-y-6">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
          {adventDays.map((day) => {
            const isUnlocked = day <= availableDays
            const isSelected = selectedDay === day
            const isUnlockedButNotSelected = unlockedDays.includes(day) && !isSelected
            const isToday = day === currentDayOfMonth
            const hint = dayMechanicsHints[day]

            return (
              <div key={day} className="flex flex-col items-center gap-1 group">
                <button
                  onClick={() => handleDayClick(day)}
                  disabled={!isUnlocked}
                  className={`relative w-full aspect-square flex flex-col items-center justify-center rounded border-2 transition-all duration-200 font-mono text-sm font-bold
                    ${isUnlocked
                      ? isToday
                        ? 'border-yellow-500 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/30'
                        : isSelected
                        ? 'border-yellow-600 bg-yellow-500/40 text-yellow-700 dark:text-yellow-300 shadow-md shadow-yellow-500/20'
                        : isUnlockedButNotSelected
                        ? 'border-yellow-400/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:border-yellow-400 hover:bg-yellow-500/20'
                        : 'border-yellow-400/30 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400 hover:border-yellow-400/60 hover:bg-yellow-500/15'
                      : 'border-gray-600/30 bg-gray-700/10 text-gray-500 cursor-not-allowed opacity-40'
                    }
                  `}
                >
                  {/* Badge for two mints starting Day 19 */}
                  {day >= 19 && (
                    <div className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-yellow-600 text-white">
                      ×2
                    </div>
                  )}
                  <div className="text-xs opacity-75">DAY</div>
                  <div className="text-lg leading-tight">{day}</div>
                  {isUnlockedButNotSelected && <div className="text-xs mt-0.5">✓</div>}
                </button>
                {/* Easter egg hint - only show on unlocked days as subtle tooltip */}
                {isUnlocked && hint && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center">
                    <div className="text-xs text-yellow-600/70 dark:text-yellow-500/70">
                      {hint.emoji}
                    </div>
                    <div className="text-[10px] text-yellow-600/50 dark:text-yellow-500/50 whitespace-nowrap px-1">
                      {hint.hint}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal for selected day */}
      {selectedDay && selectedArtPrimary && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border-2 border-yellow-600/50 rounded-lg p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-auto relative shadow-xl">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-yellow-600 hover:text-yellow-500 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6 space-y-3">
              <div className="font-mono text-sm text-yellow-600 dark:text-yellow-500 font-bold">
                🎄 DAY {selectedDay} UNLOCKED {getMintCount(selectedDay) > 1 ? '• 2 Mints Today' : ''} 🎄
              </div>
              <div className="font-mono text-xs text-yellow-600/70 dark:text-yellow-600">
                {currentDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>

            <div className={`grid ${getMintCount(selectedDay) > 1 ? 'md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
              {/* Primary Mint Panel */}
              <div className="border-2 border-yellow-600/30 rounded-lg p-4">
                <div className="mb-2">
                  <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-600/20 text-yellow-700 dark:text-yellow-400 border border-yellow-600/40">Drop A</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-yellow-700 dark:text-yellow-500 mb-2">
                  {selectedArtPrimary.name}
                </h2>
                <div className={`text-sm font-mono font-bold ${getRarityColor(selectedArtPrimary.rarity)} mb-4`}>
                  {selectedArtPrimary.rarity.toUpperCase()}
                </div>
                <div className="text-center mb-4">
                  <div className="ascii-art-full font-mono text-foreground whitespace-pre overflow-auto p-4 bg-background/50 border border-yellow-600/20 rounded text-xs md:text-sm max-h-64 inline-block w-full">
                    {selectedArtPrimary.content}
                  </div>
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-sm text-foreground">{selectedArtPrimary.description}</p>
                  <div className="text-xs text-foreground/70 space-y-1 font-mono">
                    <p>Moonynad #{selectedArtPrimary.id.toUpperCase()}</p>
                    <p>Limited Edition Christmas Drop • {currentDate.getFullYear()}</p>
                  </div>
                  <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded text-center">
                    <p className="font-mono text-xs text-yellow-600 dark:text-yellow-400">
                      🚀 NFT Minting Coming Soon!
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary Mint Panel */}
              {getMintCount(selectedDay) > 1 && selectedArtSecondary && (
                <div className="border-2 border-yellow-600/30 rounded-lg p-4">
                  <div className="mb-2">
                    <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-600/20 text-yellow-700 dark:text-yellow-400 border border-yellow-600/40">Drop B</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-yellow-700 dark:text-yellow-500 mb-2">
                    {selectedArtSecondary.name}
                  </h2>
                  <div className={`text-sm font-mono font-bold ${getRarityColor(selectedArtSecondary.rarity)} mb-4`}>
                    {selectedArtSecondary.rarity.toUpperCase()}
                  </div>
                  <div className="text-center mb-4">
                    <div className="ascii-art-full font-mono text-foreground whitespace-pre overflow-auto p-4 bg-background/50 border border-yellow-600/20 rounded text-xs md:text-sm max-h-64 inline-block w-full">
                      {selectedArtSecondary.content}
                    </div>
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="text-sm text-foreground">{selectedArtSecondary.description}</p>
                    <div className="text-xs text-foreground/70 space-y-1 font-mono">
                      <p>Moonynad #{selectedArtSecondary.id.toUpperCase()}</p>
                      <p>Limited Edition Christmas Drop • {currentDate.getFullYear()}</p>
                    </div>
                    <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded text-center">
                      <p className="font-mono text-xs text-yellow-600 dark:text-yellow-400">
                        🚀 NFT Minting Coming Soon!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}