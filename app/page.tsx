"use client"

import { useState, useEffect } from "react"
import Gallery from "@/components/gallery"
import AdventCalendar from "@/components/advent-calendar"

interface ArtPiece {
  id: string
  name: string
  content: string
  description: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
}

export default function Home() {
  const [artPieces, setArtPieces] = useState<ArtPiece[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const loadArtPieces = async () => {
      try {
        // List of ASCII art files in the pants directory with metadata
        const artFiles = [
          {
            id: 'moon',
            name: 'Moon #1',
            filename: 'moon.txt',
            description: 'The original moonynad - a classic lunar ASCII art piece',
            rarity: 'common'
          },
          {
            id: 'moon2',
            name: 'Moon #2',
            filename: 'moon2.txt',
            description: 'A more detailed lunar landscape with craters and texture',
            rarity: 'uncommon'
          },
          {
            id: 'moon3',
            name: 'Moon #3',
            filename: 'moon3.txt',
            description: 'Minimalist moon design with clean geometric lines',
            rarity: 'common'
          },
          {
            id: 'heart',
            name: 'Lunar Heart',
            filename: 'heart.txt',
            description: 'A heart-shaped moon - rare romantic edition',
            rarity: 'rare'
          },
          {
            id: 'lady',
            name: 'Moon Lady',
            filename: 'lady.txt',
            description: 'Mystical lunar goddess with flowing robes',
            rarity: 'epic'
          },
          {
            id: 'chudnovsky',
            name: 'Chudnovsky Moon',
            filename: 'chudnovsky.txt',
            description: 'Complex mathematical moon pattern',
            rarity: 'legendary'
          },
          {
            id: 'headupbutt',
            name: 'Lunar Butt',
            filename: 'headupbutt.txt',
            description: 'A cheeky moon with a playful twist',
            rarity: 'uncommon'
          },
          {
            id: 'hips',
            name: 'Moon Hips',
            filename: 'hips.txt',
            description: 'Curvaceous lunar landscape',
            rarity: 'rare'
          },
          {
            id: 'l',
            name: 'Lunar L',
            filename: 'l.txt',
            description: 'Abstract moon in the shape of letter L',
            rarity: 'common'
          },
          {
            id: 'm',
            name: 'Lunar M',
            filename: 'm.txt',
            description: 'Dual moon formation resembling letter M',
            rarity: 'common'
          },
          {
            id: 'multi',
            name: 'Multi-Moon',
            filename: 'multi.txt',
            description: 'A constellation of multiple moons',
            rarity: 'uncommon'
          },
          {
            id: 's',
            name: 'Lunar S',
            filename: 's.txt',
            description: 'Crescent moon forming an S shape',
            rarity: 'rare'
          },
          {
            id: 'xl',
            name: 'XL Moon',
            filename: 'xl.txt',
            description: 'Extra large lunar display',
            rarity: 'epic'
          }
        ]

        const loadedPieces: ArtPiece[] = []

        for (const artFile of artFiles) {
          try {
            const response = await fetch(`/pants/${artFile.filename}`)
            if (response.ok) {
              const content = await response.text()
              loadedPieces.push({
                id: artFile.id,
                name: artFile.name,
                content: content,
                description: artFile.description,
                rarity: artFile.rarity as "common" | "uncommon" | "rare" | "epic" | "legendary"
              })
            }
          } catch (err) {
            console.error(`Failed to load ${artFile.filename}:`, err)
          }
        }

        setArtPieces(loadedPieces)
        setLoading(false)
      } catch (err) {
        setError("Failed to load Moonynads gallery")
        setLoading(false)
        console.error("Error loading art pieces:", err)
      }
    }

    loadArtPieces()

    // Update current date every minute
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="font-mono text-sm text-accent animate-pulse">
          <pre className="text-center">
            {`╔════════════════════════════════════════════════╗
║   INITIALIZING MOONYNADS GALLERY...   ║
╚════════════════════════════════════════════════╝`}
          </pre>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="font-mono text-sm text-destructive">
          <pre className="text-center">
            {`╔════════════════════════════════════════════════╗
║   ERROR: ${error}   ║
╚════════════════════════════════════════════════╝`}
          </pre>
        </div>
      </div>
    )
  }

  // Calculate days until Christmas
  const currentYear = currentDate.getFullYear()
  const christmasDate = new Date(currentYear, 11, 25) // December 25th
  const daysUntilChristmas = Math.max(0, Math.floor(Number(christmasDate) - Number(currentDate)) / (1000 * 60 * 60 * 24))
  const isChristmasSeason = currentDate.getMonth() === 11 && currentDate.getDate() <= 25

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-primary">
          🌙 MOONYNADS GALLERY 🌙
        </h1>
        <p className="text-center mb-2 text-muted-foreground">
          A Collection of Lunar ASCII Art NFTs
        </p>

        {isChristmasSeason && (
          <div className="text-center mb-8 text-sm text-accent">
            <p>🎄 {daysUntilChristmas} days until Christmas! 🎄</p>
            <p className="text-xs text-muted-foreground">
              Check out our special 12 Days of Moonynads Advent Calendar below!
            </p>
          </div>
        )}

        {/* Advent Calendar Section */}
        {isChristmasSeason && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-6 text-primary">
              <span className="text-accent">╔════════════════════════════════════════════════╗</span>
              <br />
              <span className="text-primary">║ 12 DAYS OF MOONYNADS ADVENT CALENDAR ║</span>
              <br />
              <span className="text-accent">╚════════════════════════════════════════════════╝</span>
            </h2>
            <AdventCalendar artPieces={artPieces} currentDate={currentDate} />
          </section>
        )}

        {/* Main Gallery Section */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-6 text-primary">
            <span className="text-accent">╔════════════════════════════════════════════════╗</span>
            <br />
            <span className="text-primary">║ COMPLETE MOONYNADS COLLECTION ║</span>
            <br />
            <span className="text-accent">╚════════════════════════════════════════════════╝</span>
          </h2>
          <Gallery artPieces={artPieces} />
        </section>
      </div>
    </main>
  )
}