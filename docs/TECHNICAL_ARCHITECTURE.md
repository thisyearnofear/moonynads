# 🏗️ Moonynads Technical Architecture

## 🧱 Core Technologies
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with lunar theme
- **Web3**: Wagmi v2 + Viem for Monad integration
- **Animation**: HTML5 Canvas with 60fps rendering
- **Storage**: IPFS via Grove + local fallbacks
- **Farcaster**: Mini App SDK integration

## 📁 Project Structure
```
moonynads/
├── app/                  # Next.js app routes
│   ├── api/
│   │   ├── storage/      # File upload handler
│   │   ├── image/        # NFT image generation
│   │   └── metadata/     # NFT metadata API
│   └── pants/            # Animation labs
│       ├── page.tsx      # Listing page
│       └── [id]/         # Individual lab
├── components/           # React components
│   ├── ascii-animator.tsx # Main animation component
│   ├── ascii-generator-preview.tsx # Generator UI
│   └── ...other components
├── hooks/                # Custom React hooks
│   ├── useAnimationState.ts      # localStorage persistence
│   ├── useAnimationRecorder.ts   # Canvas recording
│   ├── useAnimationUpload.ts     # Upload + validation
│   └── use-ascii-generator.ts    # Deterministic ASCII generation
├── lib/
│   ├── ascii-generator.ts # Deterministic generator engine
│   ├── pants.ts          # Pants catalog
│   └── ...other utilities
├── public/
│   └── pants/            # ASCII animation frames
└── docs/                 # Documentation
```

## 🎨 Animation System

### Core Components
1. **ascii-animator.tsx**: Pure presentation layer (520 LOC)
2. **useAnimationState**: Settings management + localStorage persistence
3. **useAnimationRecorder**: Canvas capture + WebM generation
4. **useAnimationUpload**: Validation + IPFS upload pipeline

### Animation Engine Capabilities
- **7 Animation Modes**: still, lineWave, blockSway, colorCycle, glitch, frameCycle, svgWave
- **4 Color Palettes**: yellow, green, blue, rainbow
- **Advanced Effects**: speed (0-3x), amplitude (0-24px), gradient overlay, character targeting
- **Performance**: 60+ FPS canvas rendering, real-time preview

### Recording & Upload Pipeline
- WebM video capture via MediaRecorder API
- Configurable FPS (1-12) and duration
- Preview before upload functionality
- File size optimization (50-100KB target)
- IPFS storage via api.grove.storage
- Fallback to public/uploads with .meta.json

## 🔤 Deterministic ASCII Generator

### Core Features
- **Seed-based generation**: Same seed = same ASCII art (critical for NFT reproducibility)
- **4 Generation Styles**: lunar, geometric, organic, abstract
- **Configurable Parameters**: complexity (1-10), density (0.1-1.0), dimensions
- **Deterministic Validation**: 100% reproducibility tested with 0% collision rate
- **Performance**: <10ms per generation for typical sizes

### Integration
```typescript
const { ascii, isGenerating, error, generate } = useAsciiGenerator();
const { ascii, metadata } = useDeterministicAscii(seed, style);

const result = generateAsciiArt({
  seed: "moonynad-123",
  complexity: 5,
  density: 0.3,
  style: "lunar",
});
// Returns: { art: '...', metadata: {...} }
```

## 🗂️ Storage Architecture

### Provider Interface
```typescript
interface StorageProvider {
  put(opts: {
    bytes: Uint8Array;
    filename: string;
    contentType?: string;
    animationSettings?: AnimationSettings;
  }): Promise<StoreResult>;
}
```

### Providers
- **Grove**: IPFS storage via api.grove.storage
- **Local**: Fallback to public/uploads with .meta.json

## 📱 Farcaster Mini App Integration

### Configuration
- **Manifest**: `https://m00nynads.vercel.app/.well-known/farcaster.json`
- **Name**: Moonynads
- **Category**: Art & Creativity
- **Chain**: Monad (EIP155:143)
- **Dimensions**: 424x695px (desktop), full mobile

### Social Features
- **Cast Composition**: Share ASCII art with embeds
- **Mini App Launch**: Direct access from social feeds
- **OG Images**: Dynamic generation for sharing
- **Account Association**: JFS signature verification

## 🎯 Performance & Optimization
- Canvas optimization for 60fps animations
- Memory cleanup for recording/upload processes
- Responsive design for all device sizes
- Lazy loading for gallery components
- Efficient state management with React hooks