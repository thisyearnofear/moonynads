# 🌙 Moonynads Gallery

A Next.js web application showcasing a collection of lunar-themed ASCII art pieces as digital collectibles/NFTs.

## 📖 About

Moonynads Gallery is an interactive web application that displays a curated collection of 12 unique ASCII art pieces, each featuring different lunar designs with varying rarities:

- **Common** - Basic moon designs
- **Uncommon** - More detailed lunar landscapes
- **Rare** - Special moon variations
- **Epic** - Exceptional lunar artworks
- **Legendary** - Masterpiece moon creations

## 🎨 Features

### Animation Labs (`/pants`)
- Browse 12 unique ASCII animation designs with interactive controls
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
- Discover all 12 Moonynads from the listing page (`/pants`)
- Browse with rarity badges (Common, Uncommon, Rare, Epic, Legendary)
- Direct access to each design's animation lab
- Responsive design that works on all devices

### 🎄 Advent Calendar (Seasonal Feature)
- Special 12 Days of Moonynads Advent Calendar during Christmas season
- Unlocks one new Moonynad each day from December 13th to 24th
- Festive countdown showing days until Christmas
- Limited edition Christmas-themed displays

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
│   └── ...other components
├── hooks/                # Custom React hooks
│   ├── useAnimationState.ts      # localStorage persistence
│   ├── useAnimationRecorder.ts   # Canvas recording
│   └── useAnimationUpload.ts     # Upload + validation
├── lib/
│   ├── pants.ts          # Pants catalog
│   ├── storage/          # Storage providers (Grove, Local)
│   └── ...other utilities
├── public/
│   └── pants/            # ASCII animation frames
└── package.json          # Project dependencies
```

## 🎨 ASCII Art Collection

The gallery features 12 unique lunar ASCII art pieces:

1. **Moon #1** - The original moonynad
2. **Moon #2** - Detailed lunar landscape
3. **Moon #3** - Minimalist geometric design
4. **Lunar Heart** - Romantic heart-shaped moon
5. **Moon Lady** - Mystical lunar goddess
6. **Chudnovsky Moon** - Mathematical pattern
7. **Lunar Butt** - Playful cheeky moon
8. **Moon Hips** - Curvaceous landscape
9. **Lunar L** - Abstract L-shaped moon
10. **Lunar M** - Dual moon formation
11. **Multi-Moon** - Constellation of moons
12. **XL Moon** - Extra large display

## 🌟 Rarity System

Each Moonynad has a rarity level that determines its uniqueness:

- **Common** - Basic designs, more readily available
- **Uncommon** - Enhanced details and complexity
- **Rare** - Special variations with unique features
- **Epic** - Exceptional artworks with intricate details
- **Legendary** - Masterpiece creations with highest value

## 🎁 Advent Calendar

During December, the application features a special Advent Calendar:

- **12 Days of Moonynads** - From December 13th to 24th
- **Daily Unlocks** - Each day reveals a new Moonynad
- **Christmas Countdown** - Shows days remaining until Christmas
- **Festive Theme** - Special holiday styling and messaging

## 🔧 Technology Stack

- **Next.js 14** - React framework for server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React** - Component-based UI library

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by the original ASCII art community
- Special thanks to all contributors and ASCII artists
- Built with ❤️ for lunar art enthusiasts

## 🌐 Live Demo

Check out the live gallery: [Moonynads Gallery](https://moonynads.vercel.app)

---

🌙 **Collect them all!** 🌙
