import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { generateTokenMetadata } from '@/lib/blockchain'

// Consolidated metadata mapping - single source of truth
const METADATA = [
  { id: 'moon', name: 'Moon #1', rarity: 'common', description: 'The original moonynad - a classic lunar ASCII art piece' },
  { id: 'moon2', name: 'Moon #2', rarity: 'uncommon', description: 'A more detailed lunar landscape with craters and texture' },
  { id: 'moon3', name: 'Moon #3', rarity: 'common', description: 'Minimalist moon design with clean geometric lines' },
  { id: 'heart', name: 'Lunar Heart', rarity: 'rare', description: 'A heart-shaped moon - rare romantic edition' },
  { id: 'lady', name: 'Moon Lady', rarity: 'epic', description: 'Mystical lunar goddess with flowing robes' },
  { id: 'chudnovsky', name: 'Chudnovsky Moon', rarity: 'legendary', description: 'Complex mathematical moon pattern' },
  { id: 'headupbutt', name: 'Lunar Butt', rarity: 'uncommon', description: 'A cheeky moon with a playful twist' },
  { id: 'hips', name: 'Moon Hips', rarity: 'rare', description: 'Curvaceous lunar landscape' },
  { id: 'l', name: 'Lunar L', rarity: 'common', description: 'Abstract moon in the shape of letter L' },
  { id: 'm', name: 'Lunar M', rarity: 'common', description: 'Dual moon formation resembling letter M' },
  { id: 'multi', name: 'Multi-Moon', rarity: 'uncommon', description: 'A constellation of multiple moons' },
  { id: 's', name: 'Lunar S', rarity: 'rare', description: 'Crescent moon forming an S shape' },
  { id: 'xl', name: 'XL Moon', rarity: 'epic', description: 'Extra large lunar display' }
] as const

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const resolvedParams = await params
    const tokenId = parseInt(resolvedParams.tokenId)
    const baseTokenId = tokenId > 1000 ? Math.floor(tokenId / 1000) : tokenId
    const baseMetadata = METADATA[baseTokenId - 1] // Array is 0-indexed
    
    if (!baseMetadata) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 })
    }

    // Read ASCII content with error handling
    let asciiContent = ''
    try {
      const artPath = path.join(process.cwd(), 'pants', `${baseMetadata.id}.txt`)
      asciiContent = await fs.readFile(artPath, 'utf-8')
    } catch {
      asciiContent = 'ASCII art not found'
    }

    const metadata = generateTokenMetadata(tokenId, asciiContent, baseMetadata)
    
    return NextResponse.json(metadata, {
      headers: { 'Cache-Control': 'public, max-age=86400' }
    })
  } catch (error) {
    console.error('Metadata error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}