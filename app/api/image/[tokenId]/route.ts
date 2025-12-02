import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { generateTokenSVG } from '@/lib/blockchain'

const FILES = ['moon', 'moon2', 'moon3', 'heart', 'lady', 'chudnovsky', 'headupbutt', 'hips', 'l', 'm', 'multi', 's', 'xl']

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const resolvedParams = await params
    const tokenId = parseInt(resolvedParams.tokenId)
    const baseTokenId = tokenId > 1000 ? Math.floor(tokenId / 1000) : tokenId
    const filename = FILES[baseTokenId - 1] // Array is 0-indexed
    
    if (!filename) {
      return new NextResponse('Token not found', { status: 404 })
    }

    const artPath = path.join(process.cwd(), 'pants', `${filename}.txt`)
    const asciiContent = await fs.readFile(artPath, 'utf-8')
    const svg = generateTokenSVG(asciiContent, tokenId)
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400'
      }
    })
  } catch (error) {
    console.error('Image generation error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}