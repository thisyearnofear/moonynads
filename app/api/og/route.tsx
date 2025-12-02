import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Moonynads Gallery'
    const description = searchParams.get('description') || '12 Days of lunar ASCII art NFTs'

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(45deg, #0a0a0b 0%, #1a1a1b 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            fontFamily: 'monospace',
            color: '#f4f4f5',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: '72px',
                marginRight: '20px',
              }}
            >
              🌙
            </div>
            <div
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: '#eab308',
                letterSpacing: '-2px',
              }}
            >
              MOONYNADS
            </div>
          </div>

          {/* ASCII Art Sample */}
          <div
            style={{
              fontSize: '20px',
              fontFamily: 'monospace',
              color: '#f4f4f5',
              textAlign: 'center',
              lineHeight: '1.2',
              marginBottom: '40px',
              backgroundColor: '#1a1a1b',
              padding: '30px',
              borderRadius: '12px',
              border: '2px solid #eab308',
            }}
          >
            <pre>{`     ___..._
    /    \   \    
   |  O   O   |   
   |     >    |   
    \   ___  /    
     \  \_/  /     
      \_____/      `}</pre>
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '32px',
              color: '#eab308',
              textAlign: 'center',
              marginBottom: '20px',
              fontWeight: 'bold',
            }}
          >
            {title}
          </div>
          
          <div
            style={{
              fontSize: '24px',
              color: '#a1a1aa',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            {description}
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '20px',
              color: '#71717a',
            }}
          >
            <span style={{ marginRight: '10px' }}>🪙</span>
            <span>Powered by m00nynad • Monad Chain ID: 143</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}