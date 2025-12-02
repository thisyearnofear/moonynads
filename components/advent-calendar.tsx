"use client"

import { useState } from "react"

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
}

export default function AdventCalendar({ artPieces, currentDate }: AdventCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [unlockedDays, setUnlockedDays] = useState<number[]>([])

  // Calculate which days should be unlocked based on current date
  const currentDayOfMonth = currentDate.getDate()
  const currentMonth = currentDate.getMonth() // 11 = December

  // For December, unlock days 1 through current day (up to day 24)
  const availableDays = currentMonth === 11 ? Math.min(currentDayOfMonth, 24) : 0

  // Generate the 12 days advent calendar (days 13-24 for Christmas countdown)
  const adventDays = Array.from({ length: 12 }, (_, i) => i + 13)

  const handleDayClick = (day: number) => {
    if (day <= availableDays) {
      setSelectedDay(day)
      // Mark as unlocked if not already
      if (!unlockedDays.includes(day)) {
        setUnlockedDays([...unlockedDays, day])
      }
    }
  }

  const handleCloseModal = () => {
    setSelectedDay(null)
  }

  // Get a random art piece for the selected day
  const getArtForDay = (day: number): ArtPiece | null => {
    if (!artPieces.length) return null

    // Use day number to seed the selection for consistency
    const seed = day % artPieces.length
    return artPieces[seed]
  }

  const selectedArt = selectedDay ? getArtForDay(selectedDay) : null

  // Rarity colors
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-muted-foreground'
      case 'uncommon': return 'text-accent'
      case 'rare': return 'text-primary'
      case 'epic': return 'text-destructive'
      case 'legendary': return 'text-[#FFD700]' // Gold
      default: return 'text-foreground'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        {adventDays.map((day) => {
          const isUnlocked = day <= availableDays
          const isSelected = selectedDay === day
          const isUnlockedButNotSelected = unlockedDays.includes(day) && !isSelected

          return (
            <div
              key={day}
              className={`aspect-square p-2 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300
                ${isUnlocked
                  ? 'border-accent bg-card/50 hover:bg-accent/10'
                  : 'border-border bg-card/30 cursor-not-allowed'
                }
                ${isSelected ? 'ring-2 ring-ring' : ''}
                ${isUnlockedButNotSelected ? 'opacity-70' : ''}
              `}
              onClick={() => handleDayClick(day)}
            >
              <div className="text-center font-mono">
                <div className={`text-xs ${isUnlocked ? 'text-accent' : 'text-border'}`}>DAY</div>
                <div className={`text-lg font-bold ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>{day}</div>
                {isUnlockedButNotSelected && (
                  <div className="text-xs text-accent mt-1">✓</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal for selected day */}
      {selectedDay && selectedArt && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in-modal">
          <div className="bg-card p-6 md:p-8 rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-auto relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-destructive hover:text-destructive-foreground transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary mb-2">🎄 DAY {selectedDay} 🎄</h2>
              <div className="font-mono text-sm text-muted-foreground mb-4">
                {currentDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="text-xl font-semibold text-foreground mb-2">{selectedArt.name}</h3>
                <div className={`text-sm ${getRarityColor(selectedArt.rarity)} font-mono`}>
                  ■ Rarity: {selectedArt.rarity.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="ascii-art-full font-mono text-accent whitespace-pre overflow-auto mb-6 p-4 bg-background/20 rounded">
              {selectedArt.content}
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-muted-foreground text-sm mb-4">{selectedArt.description}</p>

              <div className="text-xs text-muted-foreground/70">
                <p>🌙 Moonynad #{selectedArt.id.toUpperCase()}</p>
                <p>🎁 Limited Edition Christmas Drop</p>
                <p>📅 {currentDate.getFullYear()} Advent Calendar Collection</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}