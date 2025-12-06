# 🌙 Moonynads Gallery

A Next.js web application showcasing a collection of lunar-themed ASCII art pieces as digital collectibles/NFTs.

## 📖 About

Moonynads Gallery is an interactive web application that displays a curated collection of ASCII art pieces, each featuring different lunar designs with varying rarities:

- **Common** - Basic moon designs
- **Uncommon** - More detailed lunar landscapes
- **Rare** - Special moon variations
- **Epic** - Exceptional lunar artworks
- **Legendary** - Masterpiece moon creations

## 🎨 Features

### Animation Labs (`/pants`)
- Browse multiple ASCII animation designs with interactive controls
- Real-time animation preview with 7 animation modes (lineWave, blockSway, colorCycle, glitch, etc.)
- 4-color palette selection (yellow, green, blue, rainbow)
- Speed and amplitude controls for fine-tuned animations
- Target character/set highlighting for focus effects
- **Persistent state**: Animation settings auto-saved per design in localStorage
- **Recording**: Capture animations as WebM video with customizable FPS
- **Upload**: Save snapshots (PNG) or animations (WebM) with metadata to Grove storage

### Storage Integration
- Multi-provider storage abstraction (Grove + Local fallback)
- Animation settings captured with every upload for reproducibility
- Metadata persistence for animation recreation

### Main Gallery
- Discover all Moonynads from the listing page (`/pants`)
- Browse with rarity badges (Common, Uncommon, Rare, Epic, Legendary)
- Direct access to each design's animation lab
- Responsive design that works on all devices

### 🎄 Advent Calendar (Seasonal Feature)
- Special 24 Days of Moonynads Advent Calendar during Christmas season
- Unlocks one new Moonynad each day from December 13th to 24th
- Festive countdown showing days until Christmas
- Limited edition Christmas-themed displays

### 🎨 Deterministic ASCII Generator
- Seed-based generation: Same seed = same ASCII art (critical for NFT reproducibility)
- 4 generation styles: lunar, geometric, organic, abstract
- Configurable parameters: complexity (1-10), density (0.1-1.0), dimensions
- Performance: <10ms per generation for typical sizes

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
git clone https://github.com/thisyearnofear/moonynads.git
cd moonynads
npm install
```

### Running the Application
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Building for Production
```bash
npm run build
npm run start
```

## 🎯 Ecosystem Integration

### Cross-Platform Synergy
- **m00n.app**: Tournament score integration
- **M00nlander**: Achievement-based rewards
- **M00nCabal**: Exclusive member benefits
- **Farcaster**: Social sharing and Mini App integration

### Token Utility ($m00nad)
- **Payment Currency**: All mints use m00nad tokens
- **Tiered Access**: Holdings determine gallery access
- **Ecosystem Rewards**: Cross-platform achievements
- **Governance**: Community voting on future drops

### 🔐 Three-Tier Allowlist System
| Tier | Price | Requirement |
|------|--------|-------------|
| **None** | 100M m00nad | General public |
| **Discount** | 50M m00nad | Tier 1 allowlist |
| **Free** | 0M m00nad | Tier 2 allowlist |

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
├── docs/                 # Comprehensive documentation
└── package.json          # Project dependencies
```

## 🔧 Technology Stack

- **Next.js 15** - React framework for server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React** - Component-based UI library
- **Wagmi/viem** - Web3 integration for Monad blockchain
- **HTML5 Canvas** - 60fps animation rendering

## 📚 Documentation

For comprehensive project documentation, see the detailed guides in `/docs/`:

- **[Getting Started](docs/GETTING_STARTED.md)** - Quick start guide and project overview
- **[Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md)** - System design, components, and implementation details
- **[Blockchain Integration](docs/BLOCKCHAIN_INTEGRATION.md)** - Smart contracts, token payments, and deployment guides
- **[Advent Calendar Strategy](docs/ADVENT_CALENDAR.md)** - Day-by-day mechanics, pricing strategy, and implementation roadmap

## 🌐 Live Demo

Check out the live gallery: [Moonynads Gallery](https://moonynads.vercel.app)

---

🌙 **Collect them all!** 🌙