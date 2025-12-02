import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { generateTokenMetadata } from '@/lib/blockchain'
import { PANTS } from '@/lib/pants'

const METADATA = PANTS

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
      const artPath = path.join(process.cwd(), 'public', 'pants', `${baseMetadata.id}.txt`)
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
