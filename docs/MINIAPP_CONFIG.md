# Miniapp Configuration

## Single Source of Truth

All Farcaster Mini App configuration is now centralized in `/lib/miniapp-config.ts`.

This consolidates configuration that was previously scattered across:
- `/app/layout.tsx`
- `/components/farcaster-provider.tsx`
- `/public/.well-known/farcaster.json`

## Configuration Structure

### `MINIAPP_CONFIG`
Core settings used across layouts and embeds:
- `version`: "1"
- `name`: "Moonynads"
- `homeUrl`: "https://m00nynads.vercel.app"
- `iconUrl`: URL to 1024x1024px PNG icon
- `imageUrl`: URL to 1200x630px (3:2 ratio) banner
- `buttonTitle`: "🌙 Explore Gallery"
- `splashImageUrl`: URL to 200x200px splash image
- `splashBackgroundColor`: "#0a0a0b"

### `MINIAPP_METADATA`
Discovery and categorization:
- `subtitle`: "Token-Gated ASCII Art NFTs"
- `description`: Full app description
- `tagline`: "12 Days of lunar NFTs" (marketing tagline, max 30 chars)
- `primaryCategory`: "art-creativity"
- `tags`: ["nft", "ascii-art", "monad", "advent", "art"]
- `heroImageUrl`: 1200x630px promotional image
- `screenshotUrls`: Array of portrait screenshots (1284x2778)

### `MINIAPP_OPENGRAPH`
Social sharing metadata:
- `ogTitle`: "Moonynads Gallery"
- `ogDescription`: "12 Days of lunar ASCII art NFTs with dynamic minting mechanics"
- `ogImageUrl`: Share image URL

## Helper Functions

### `generateMiniAppEmbed()`
Returns the fc:miniapp embed object for social sharing:
```json
{
  "version": "1",
  "imageUrl": "...",
  "button": {
    "title": "...",
    "action": {
      "type": "launch_miniapp",
      "name": "...",
      "url": "...",
      "splashImageUrl": "...",
      "splashBackgroundColor": "..."
    }
  }
}
```

### `generateManifest(accountAssociation)`
Returns the complete manifest object for `/.well-known/farcaster.json`

## Usage Examples

### In layout.tsx (Next.js metadata)
```typescript
import { MINIAPP_CONFIG, MINIAPP_METADATA, MINIAPP_OPENGRAPH, generateMiniAppEmbed } from '@/lib/miniapp-config'

export const metadata: Metadata = {
  title: `${MINIAPP_CONFIG.name} Gallery - ${MINIAPP_METADATA.subtitle}`,
  openGraph: {
    title: MINIAPP_OPENGRAPH.ogTitle,
    images: [{ url: MINIAPP_CONFIG.imageUrl }]
  },
  other: {
    'fc:miniapp': JSON.stringify(generateMiniAppEmbed())
  }
}
```

### In FarcasterProvider
```typescript
import { generateMiniAppEmbed } from '@/lib/miniapp-config'

const miniappEmbed = generateMiniAppEmbed()
// Use to create meta tag
```

## Updating Configuration

To change any mini app setting:
1. Update the value in `/lib/miniapp-config.ts`
2. All files that import from it will automatically use the new value
3. No manual sync needed across multiple files

## Farcaster Spec Compliance

All configurations comply with December 2025 Farcaster Mini Apps specification:
- ✅ Image aspect ratios (3:2 for embeds/OG, 1:1 for icon)
- ✅ Character limits on fields
- ✅ Valid category options
- ✅ Tag formatting (lowercase, no spaces)
- ✅ SDK action types (launch_miniapp)
