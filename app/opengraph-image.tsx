import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'Moonynads - ASCII Art NFT Gallery'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(to bottom, #0a0a0b, #1a1a1b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: '#eab308',
          fontFamily: 'monospace',
          gap: 20,
        }}
      >
        <div style={{ fontSize: 72 }}>🌙</div>
        <div style={{ fontSize: 56, fontWeight: 'bold' }}>MOONYNADS</div>
        <div style={{ fontSize: 28, color: '#d4af37' }}>
          12 Days of ASCII Art NFTs
        </div>
        <div style={{ fontSize: 20, color: '#eab308', opacity: 0.8 }}>
          Token-Gated Collection on Monad
        </div>
      </div>
    ),
    { ...size }
  )
}
