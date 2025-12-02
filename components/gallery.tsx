"use client"

import { useState } from "react"

interface ArtPiece {
  id: string
  name: string
  content: string
  description: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  tokenId?: number
  owned?: boolean
}

interface GalleryProps {
  artPieces: ArtPiece[]
}

export default function Gallery({ artPieces }: GalleryProps) {
  const [selectedArt, setSelectedArt] = useState<ArtPiece | null>(null)

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

  const handleArtClick = (piece: ArtPiece) => {
    setSelectedArt(piece)
  }

  const handleCloseModal = () => {
    setSelectedArt(null)
  }

  return (
    <div className="max-w-6xl mx-auto">

      {/* Gallery grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artPieces.length > 0 ? (
            artPieces.map((piece) => (
                <button
                  key={piece.id}
                  onClick={() => handleArtClick(piece)}
                  className="group text-left bg-card border border-yellow-600/30 hover:border-yellow-600/70 rounded-lg p-5 transition-all duration-200 hover:shadow-md hover:shadow-yellow-500/10"
                >
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h3 className="text-base font-bold text-yellow-700 dark:text-yellow-500 group-hover:text-yellow-600 dark:group-hover:text-yellow-400">{piece.name}</h3>
                    <span className={`text-xs font-mono font-bold whitespace-nowrap ${getRarityColor(piece.rarity)}`}>
                      {piece.rarity.toUpperCase()}
                    </span>
                  </div>
                  <div className="ascii-art font-mono text-xs text-foreground/70 whitespace-pre overflow-auto max-h-40 mb-3 leading-tight">
                    {piece.content}
                  </div>
                  <p className="text-xs text-foreground/60 line-clamp-2">
                    {piece.description}
                  </p>
                </button>
              ))
            ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <p>No ASCII art found matching your search.</p>
          </div>
        )}
      </div>

      {/* Modal for full-size view */}
      {selectedArt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border-2 border-yellow-600/50 rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-auto relative shadow-xl">
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
              <h2 className="text-3xl font-bold text-yellow-700 dark:text-yellow-500">
                🌙 {selectedArt.name}
              </h2>

              {/* Rarity badge */}
              <div className="inline-flex items-center gap-2">
                <span className={`text-sm font-mono font-bold ${getRarityColor(selectedArt.rarity)}`}>
                  {selectedArt.rarity.toUpperCase()}
                </span>
              </div>

              <p className="text-foreground text-sm max-w-2xl mx-auto">
                {selectedArt.description}
              </p>
            </div>

            <div className="ascii-art-full font-mono text-foreground whitespace-pre overflow-auto mb-6 p-5 bg-background/50 border border-yellow-600/20 rounded text-sm max-h-96 leading-tight">
              {selectedArt.content}
            </div>

            <div className="border-t border-yellow-600/30 pt-4 text-xs text-foreground/70 space-y-1 font-mono">
              <p>Moonynad #{selectedArt.id.toUpperCase()}</p>
              <p>ASCII Art Collection • Digital Collectible</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}