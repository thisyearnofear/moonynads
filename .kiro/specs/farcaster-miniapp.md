# Farcaster Mini App Integration Specification

## Overview
Integrate Moonynads as a Farcaster Mini App following 2025 standards with proper manifest, SDK lifecycle, and responsive design.

## Requirements

### Manifest Configuration
- **Location**: `/.well-known/farcaster.json`
- **Format**: JSON with specific fields
- **Validation**: Must pass Warpcast validation

### Required Fields
```json
{
  "accountAssociation": {
    "header": "base64_encoded_header",
    "payload": "base64_encoded_payload",
    "signature": "base64_encoded_signature"
  },
  "frame": {
    "version": "next",
    "name": "Moonynads",
    "iconUrl": "https://m00nynads.vercel.app/icon.svg",
    "splashImageUrl": "https://m00nynads.vercel.app/moonynad-splash.png",
    "splashBackgroundColor": "#0a0a0b",
    "homeUrl": "https://m00nynads.vercel.app",
    "webhookUrl": "https://m00nynads.vercel.app/api/webhook"
  }
}
```

### SDK Integration
1. **Initialization**
   - Import `@farcaster/miniapp-sdk`
   - Call `sdk.actions.ready()` immediately
   - Load heavy content asynchronously

2. **Actions**
   - `composeCast(text, embeds)`: Share to Farcaster
   - `closeApp()`: Close mini app modal
   - `openUrl(url)`: Open external links

3. **Context**
   - `sdk.context.user`: Current user info
   - `sdk.context.client`: Client information

### Responsive Design
- **Desktop Modal**: 424px × 695px
- **Mobile**: Full device dimensions
- **Orientation**: Vertical only
- **OG Image**: 1200px × 630px (1.91:1 ratio)

## Technical Architecture

### Provider Setup
```typescript
'use client'

import { FarcasterProvider } from '@/components/farcaster-provider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FarcasterProvider>
          {children}
        </FarcasterProvider>
      </body>
    </html>
  )
}
```

### SDK Wrapper
```typescript
// lib/farcaster.ts
import sdk from '@farcaster/miniapp-sdk'

export async function initFarcasterSDK() {
  if (typeof window === 'undefined') return
  
  // Call ready immediately for fast embed loading
  await sdk.actions.ready()
  
  return sdk
}

export async function composeCast(text: string, embeds?: string[]) {
  return sdk.actions.composeCast({ text, embeds })
}

export async function closeApp() {
  return sdk.actions.closeApp()
}
```

### Metadata Configuration
```typescript
// app/layout.tsx
export const metadata = {
  title: 'Moonynads',
  description: 'ASCII Art NFT Gallery on Monad',
  openGraph: {
    title: 'Moonynads',
    description: 'ASCII Art NFT Gallery',
    images: ['/moonynad-embed.png'],
  },
  other: {
    'fc:miniapp': 'true',
    'fc:miniapp:manifest': 'https://m00nynads.vercel.app/.well-known/farcaster.json',
  },
}
```

## Implementation Details

### Async Loading Strategy
```typescript
// Problem: Heavy ASCII art loading delays ready() call
// Solution: Call ready() immediately, load art in background

useEffect(() => {
  // Initialize SDK immediately
  initFarcasterSDK()
  
  // Load ASCII art asynchronously
  loadAsciiArt().then(setFrames)
}, [])
```

### Wallet Connector Integration
```typescript
import { farcasterMiniAppConnector } from '@farcaster/miniapp-wagmi-connector'

const config = createConfig({
  connectors: [
    farcasterMiniAppConnector(),
    metaMask(),
    walletConnect(),
  ],
  // ...
})
```

### Share Functionality
```typescript
async function shareToFarcaster(designId: string) {
  const url = `https://m00nynads.vercel.app/pants/${designId}`
  await composeCast(
    `Check out this Moonynad! 🌙`,
    [url]
  )
}
```

## Asset Requirements

### App Icon
- **Size**: 1024px × 1024px
- **Format**: PNG or SVG
- **Background**: Transparent or solid
- **Usage**: App store listing

### Splash Screen
- **Size**: 200px × 200px
- **Format**: PNG
- **Background**: #0a0a0b (dark)
- **Usage**: Loading screen

### OG Image
- **Size**: 1200px × 630px
- **Ratio**: 1.91:1
- **Format**: PNG or JPEG
- **Usage**: Social sharing previews

### Screenshots
- **Size**: 1284px × 2778px (portrait)
- **Count**: 3 minimum
- **Format**: PNG or JPEG
- **Usage**: App store gallery

## Deployment Checklist

- [x] Manifest created at `/.well-known/farcaster.json`
- [x] SDK initialized in app
- [x] `ready()` called immediately
- [x] Async art loading implemented
- [x] Wallet connector integrated
- [x] Share functionality working
- [x] Responsive design tested
- [ ] Account association signature added
- [ ] App icon uploaded (1024×1024)
- [ ] Splash screen uploaded (200×200)
- [ ] OG image uploaded (1200×630)
- [ ] Screenshots uploaded (3×)
- [ ] Tested in Warpcast

## Success Criteria
- [ ] Manifest validates in Warpcast
- [ ] App loads in <2 seconds
- [ ] Embed displays correctly in casts
- [ ] Share button posts to Farcaster
- [ ] Wallet connects via Farcaster connector
- [ ] Responsive on mobile and desktop
- [ ] No console errors in production

## Kiro Implementation Notes
- Debugged embed loading issues through iterative testing
- Fixed timing by calling ready() immediately
- Implemented async art loading strategy
- Configured proper cache headers for images
- Integrated Farcaster wallet connector with wagmi
