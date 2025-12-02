"use client"

import { useState } from "react"

interface ArtPiece {
  id: string
  name: string
  content: string
  description: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
}

interface GalleryProps {
  artPieces: ArtPiece[]
}

export default function Gallery({ artPieces }: GalleryProps) {
  const [selectedArt, setSelectedArt] = useState<ArtPiece | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredArtPieces = artPieces.filter(piece =>
    piece.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      {/* Search bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search ASCII art..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 bg-card text-card-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring search-focus"
        />
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtPieces.length > 0 ? (
          filteredArtPieces.map((piece) => (
              <div
                key={piece.id}
                className="bg-card p-6 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer card-hover"
                onClick={() => handleArtClick(piece)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-primary">{piece.name}</h3>
                  <span className={`text-xs font-mono ${getRarityColor(piece.rarity)}`}>
                    ■ {piece.rarity.toUpperCase()}
                  </span>
                </div>
                <div className="ascii-art font-mono text-sm text-muted-foreground whitespace-pre overflow-auto max-h-48 mb-4">
                  {piece.content}
                </div>
                <p className="text-xs text-muted-foreground/80 truncate">
                  {piece.description}
                </p>
              </div>
            ))
          ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <p>No ASCII art found matching your search.</p>
          </div>
        )}
      </div>

      {/* Modal for full-size view */}
      {selectedArt && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in-modal">
          <div className="bg-card p-8 rounded-lg border border-border max-w-4xl w-full max-h-[90vh] overflow-auto relative">
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
              <h2 className="text-2xl font-bold text-primary mb-2">
                🌙 {selectedArt.name}
              </h2>

              {/* Rarity badge */}
              <div className="inline-flex items-center gap-2 mb-4">
                <span className={`text-sm font-mono ${getRarityColor(selectedArt.rarity)}`}>
                  ■ {selectedArt.rarity.toUpperCase()} MOONYNAD
                </span>
              </div>

              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                {selectedArt.description}
              </p>
            </div>

            <div className="ascii-art-full font-mono text-accent whitespace-pre overflow-auto mb-6 p-4 bg-background/20 rounded">
              {selectedArt.content}
            </div>

            <div className="border-t border-border pt-4 text-xs text-muted-foreground/70">
              <p>🌙 Moonynad #{selectedArt.id.toUpperCase()}</p>
              <p>🎨 ASCII Art Collection</p>
              <p>🖼️ Digital Collectible</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}