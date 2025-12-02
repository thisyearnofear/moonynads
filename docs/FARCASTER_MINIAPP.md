# Farcaster Mini App Integration

Moonynads is fully configured as a Farcaster Mini App following the 2025 standards.

## 📋 Configuration

### Manifest (`.well-known/farcaster.json`)

The mini app manifest is hosted at:
```
https://m00nynads.vercel.app/.well-known/farcaster.json
```

**Key Configuration:**
- **Name**: Moonynads
- **Category**: Art & Creativity
- **Home URL**: https://m00nynads.vercel.app
- **Required Chains**: Monad (EIP155:143)
- **Splash Screen**: 200x200px icon with dark background (#0a0a0b)
- **Icon**: SVG logo for app discovery

### Mini App Embed Meta Tags

The app includes `fc:miniapp` meta tags in the document head for feed discoverability:

```json
{
  "version": "1",
  "imageUrl": "https://m00nynads.vercel.app/og-image.png",
  "button": {
    "title": "🌙 View Gallery",
    "action": {
      "type": "launch_frame",
      "name": "Moonynads",
      "url": "https://m00nynads.vercel.app",
      "splashImageUrl": "https://m00nynads.vercel.app/icon.svg",
      "splashBackgroundColor": "#0a0a0b"
    }
  }
}
```

## 🔌 SDK Integration

### Initialization

The `FarcasterProvider` component automatically initializes the SDK:

```typescript
import { FarcasterProvider } from '@/components/farcaster-provider'

// Wrap your app
<FarcasterProvider>
  <YourApp />
</FarcasterProvider>
```

### Available Functions

#### `initFarcasterSDK()`
Initializes the SDK and signals readiness to Farcaster.
```typescript
import { initFarcasterSDK } from '@/lib/farcaster'
await initFarcasterSDK()
```

#### `composeCast(text)`
Prompts user to compose and send a cast.
```typescript
import { composeCast } from '@/lib/farcaster'
await composeCast("Check out Moonynads! 🌙")
```

#### `closeApp()`
Closes the mini app and returns to Farcaster.
```typescript
import { closeApp } from '@/lib/farcaster'
await closeApp()
```

## 🎨 Share Component

Use the `FarcasterShare` component to add Farcaster sharing:

```typescript
import { FarcasterShare } from '@/components/farcaster-share'

<FarcasterShare 
  title="Check out Moonynads"
  description="Token-gated ASCII art NFTs with dynamic mechanics on Monad"
/>
```

## 📱 Responsive Design

The app is optimized for Farcaster's viewport:
- **Desktop**: 424x695px modal
- **Mobile**: Full device dimensions
- **Orientation**: Vertical

The minimal design ensures excellent UX in Farcaster's constrained viewport while maintaining full functionality on web.

## 🖼️ Open Graph Support

Dynamic OG image generation via `opengraph-image.tsx`:
- **Size**: 1200x630px (1.91:1 ratio)
- **Format**: PNG
- **Auto-generated**: Displays Moonynads branding

## 🚀 Deployment Checklist

Before going live:

- [ ] Update `accountAssociation` in manifest with proper JFS signature (if domain ownership verification needed)
- [ ] Create and upload 1024x1024px app icon (currently using SVG)
- [ ] Create 200x200px splash screen icon
- [ ] Upload 1200x630px OG image
- [ ] Add up to 3 app screenshots (1284x2778px portrait)
- [ ] Enable Developer Mode in Farcaster to test
- [ ] Test in Warpcast mini app store
- [ ] Verify embed displays correctly in casts

## 📚 Resources

- [Farcaster Mini Apps Specification](https://miniapps.farcaster.xyz/docs/specification)
- [SDK Documentation](https://miniapps.farcaster.xyz/docs/sdk)
- [Getting Started Guide](https://miniapps.farcaster.xyz/docs/getting-started)
- [Examples](https://github.com/farcasterxyz/miniapps/tree/main/examples)

## 🔐 Security Notes

- Never expose private keys in the client-side code
- Use environment variables for sensitive data
- Validate all user inputs before processing
- Always ask users for confirmation before executing transactions
- Implement proper error handling for SDK failures

## 🐛 Troubleshooting

### Splash Screen Not Hiding
Make sure `sdk.actions.ready()` is called after your app fully loads:
```typescript
useEffect(() => {
  initFarcasterSDK()
}, [])
```

### Cast Composition Not Working
Ensure the user is logged into Farcaster and has the app open within Warpcast or another Farcaster client.

### Icon Not Displaying
Verify the icon URL is:
- Accessible and publicly available
- 1024x1024px PNG format
- No transparent alpha channel

## 📊 Analytics & Monitoring

The app includes:
- Vercel Analytics for general performance
- Farcaster SDK error logging
- Console warnings for debugging

Consider adding custom analytics to track:
- Mini app installations
- User sessions within app
- Gallery views and interactions
- Transaction success rates

---

**Last Updated**: December 2024  
**Farcaster Mini App Version**: 1  
**Next.js Version**: 15.5.6
