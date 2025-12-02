# Moonynads Comprehensive Documentation

## 📚 Table of Contents

1. [Project Overview](#project-overview)
2. [Farcaster Mini App Integration](#farcaster-mini-app-integration)
3. [Miniapp Configuration](#miniapp-configuration)
4. [Blockchain Infrastructure](#blockchain-infrastructure)
5. [Lunar Tier System](#lunar-tier-system)
6. [Theme Consistency & Design](#theme-consistency--design)
7. [Technical Implementation](#technical-implementation)
8. [Deployment & Operations](#deployment--operations)
9. [Resources & Support](#resources--support)

---

## 🌙 Project Overview

Moonynads is an onchain NFT gallery featuring ASCII art collectibles on the Monad blockchain. The platform combines:

- **Farcaster Mini App** integration for social discovery
- **Lunar-themed token-gated access** system with progressive tiers
- **ASCII art NFTs** with dynamic rarity mechanics
- **Monad blockchain** for fast, low-cost transactions

---

## 📱 Farcaster Mini App Integration

### Configuration & Setup

**Manifest Location**: `https://m00nynads.vercel.app/.well-known/farcaster.json`

**Key Configuration:**
- **Name**: Moonynads
- **Category**: Art & Creativity
- **Home URL**: https://m00nynads.vercel.app
- **Required Chains**: Monad (EIP155:143)
- **Splash Screen**: 200x200px icon with dark background (#0a0a0b)
- **Icon**: SVG logo for app discovery

### SDK Integration

```typescript
// Initialize Farcaster SDK
import { FarcasterProvider } from '@/components/farcaster-provider'
import { initFarcasterSDK, composeCast, closeApp } from '@/lib/farcaster'

// Usage examples
await initFarcasterSDK()
await composeCast("Check out Moonynads! 🌙")
await closeApp()
```

### Responsive Design

- **Desktop**: 424x695px modal
- **Mobile**: Full device dimensions
- **Orientation**: Vertical
- **OG Image**: 1200x630px (1.91:1 ratio) dynamic generation

### Deployment Checklist

- [ ] Update `accountAssociation` in manifest with JFS signature
- [ ] Create/upload 1024x1024px app icon
- [ ] Create 200x200px splash screen icon
- [ ] Upload 1200x630px OG image
- [ ] Add 3 app screenshots (1284x2778px portrait)
- [ ] Test in Warpcast mini app store
- [ ] Verify embed displays correctly in casts

---

## ⛓️ Blockchain Infrastructure

### Smart Contract Architecture

**Core Contract**: `Moonynads.sol` (ERC721 with Enumerable, URIStorage, Pausable extensions)

**Key Features:**
- Advent calendar minting (Dec 13-24)
- Dynamic rarity based on mint order
- Daily mint limits (100 per day)
- Affordable minting (0.001 MON ~$0.01)
- Metadata and image generation

### Deployment on Monad

**Prerequisites:**
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Environment setup
cd blockchain
cp .env.example .env
```

**Deployment Commands:**
```bash
# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts

# Compile & deploy
forge build
forge script script/Deploy.s.sol --rpc-url https://rpc.monad.xyz --broadcast --verify

# Verify contract
forge verify-contract <CONTRACT_ADDRESS> src/Moonynads.sol:Moonynads \
  --rpc-url https://rpc.monad.xyz \
  --constructor-args $(cast abi-encode "constructor(string,string,string)" "Moonynads" "MOONY" "https://moonynads.xyz/api/metadata")
```

### API Endpoints

- **Metadata API**: `/api/metadata/[tokenId]` - Standard NFT metadata with dynamic rarity
- **Image API**: `/api/image/[tokenId]` - SVG image generation from ASCII art

### Monad Network Details

- **Chain ID**: 143
- **Currency**: MON
- **RPC**: https://rpc.monad.xyz
- **Explorer**: https://monadvision.com
- **Mint Cost**: 0.001 MON (~$0.01)
- **Gas Price**: ~1 gwei
- **Block Time**: ~1 second

---

## 🌕 Lunar Tier System

### Tier Progression

| Tier | Emoji | Name | Token Range | Days Unlocked | Description |
|------|-------|----------------------|----------------|----------------|-----------------------------|
| 0 | 🌑 | LUNAR VISITOR | 0 | 0 | Awaiting lunar alignment |
| 1 | 🌒 | CRESCENT HOLDER | 250M-450M | 1-3 | Crescent phase holder |
| 2 | 🌓 | HALF MOON SEEKER | 350M-550M | 4-6 | Half moon phase holder |
| 3 | 🌔 | WAXING COLLECTOR | 450M-650M | 7-9 | Waxing moon collector |
| 4 | 🌕 | LUNATIC ELITE | 550M-750M | 10-11 | Elite lunar collector |
| 5 | ⭐ | CELESTIAL WHALE | 850M+ | 12 | Complete lunar mastery |

### Visual Design

- **ASCII Art Badges**: Each tier has unique boxed ASCII representation
- **Moon Phase Progression**: 🌑 → 🌒 → 🌓 → 🌔 → 🌕 → ⭐
- **Color Palette**:
  - Crescent: Amber
  - Half Moon: Blue
  - Waxing: Yellow/Gold
  - Full Moon: Purple
  - Celestial: Cyan

### Implementation Files

1. **lib/tier-system.ts** - Tier configuration and helper functions
2. **hooks/use-advent-access.ts** - Tier access logic
3. **components/token-gate.tsx** - Tier badge display with ASCII art

---

## 🎨 Theme Consistency & Design

### Current Status: **PARTIALLY COHESIVE** (7/10)

**What's Working:**
- Hero section with strong ASCII art and monospace aesthetics ✓
- Footer with clean, minimal, thematic design ✓
- Tier system completely redesigned with lunar phases ✓
- Token gate with lunar language and ASCII badges ✓
- Layout/metadata with OG images and thematic titles ✓

### Theme Consistency Scorecard

| Component | Theme Alignment | Messaging | Visual | Overall |
|-----------|-----------------|-----------|--------|---------|
| Hero Section | ✓ | ✓ | ✓ | 10/10 |
| Footer | ✓ | ✓ | ✓ | 10/10 |
| Tier System | ✓ | ✓ | ✓ | 10/10 |
| Token Gate | ✓ | ✓ | ✓ | 10/10 |
| Layout/Meta | ✓ | ✓ | ✓ | 10/10 |
| Wallet Connect | ~ | ✗ | ✓ | 5/10 |
| Preview Banner | ~ | ✗ | ✓ | 6/10 |
| Moonverse Nav | ~ | ~ | ✓ | 7/10 |
| Farcaster Share | ~ | ✗ | ✓ | 5/10 |
| Token Banner | ~ | ✗ | ✓ | 6/10 |

### Lunar Vocabulary Guide

| Generic Term | Lunar Alternative |
|--------------|-------------------|
| Connect | Align, Synchronize, Attune |
| Wallet | Vault, Holdings, Treasury |
| Balance | Holdings, Cosmic Account |
| Tokens | Lunar Assets, Moon Holdings |
| Access | Ascend, Unlock Phase, Reveal |
| Share | Broadcast, Transmit, Radiate |
| Explore | Traverse, Navigate, Venture |
| View | Gaze Upon, Observe, Perceive |
| Preview | Lunar Glimpse, Phase Preview |
| Loading | Aligning coordinates, Channeling lunar energy |

---

## 🔧 Technical Implementation

### Frontend Stack

- **Framework**: Next.js 15.5.6
- **Styling**: Tailwind CSS with custom monospace fonts
- **Web3**: Wagmi + Viem for Monad integration
- **State Management**: React hooks and context

### Key Components

1. **Farcaster Integration**: `components/farcaster-provider.tsx`, `lib/farcaster.ts`
2. **Wallet Connect**: `components/wallet-connect.tsx`, `lib/wagmi.ts`
3. **Token Gating**: `components/token-gate.tsx`, `hooks/use-token-balance.ts`
4. **NFT Gallery**: `components/gallery.tsx`, `lib/contracts.ts`
5. **Tier System**: `lib/tier-system.ts`, `hooks/use-advent-access.ts`

### Environment Variables

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
```

---

## 🚀 Deployment & Operations

### Development Workflow

```bash
# Local development
npm install
npm run dev

# Contract testing
cd blockchain
forge test

# Frontend testing
npm run test
```

### Deployment Checklist

**Pre-deployment:**
- [ ] Test contracts thoroughly
- [ ] Set correct base URI for metadata
- [ ] Configure network settings
- [ ] Fund deployer wallet with MON

**Post-deployment:**
- [ ] Update contract address in frontend
- [ ] Test minting functionality
- [ ] Verify contract on block explorer
- [ ] Deploy metadata/image APIs
- [ ] Test end-to-end flow

**Mainnet Launch:**
- [ ] Deploy to production environment
- [ ] Monitor contract interactions
- [ ] Set up analytics tracking
- [ ] Prepare marketing materials
- [ ] Community announcement

---

## 📚 Resources & Support

### Monad Documentation

- [Official Docs](https://docs.monad.xyz)
- [Network Details](https://docs.monad.xyz/technical-discussion/networking)
- [Developer Tools](https://docs.monad.xyz/tooling-and-infrastructure)

### Block Explorers

- [MonadVision](https://monadvision.com)
- [MonadScan](https://monadscan.com)
- [SocialScan](https://monad.socialscan.io)

### Community

- [Discord](https://discord.gg/monad)
- [Twitter](https://twitter.com/monad_xyz)
- [GitHub](https://github.com/monadxyz)

### Farcaster Resources

- [Mini Apps Specification](https://miniapps.farcaster.xyz/docs/specification)
- [SDK Documentation](https://miniapps.farcaster.xyz/docs/sdk)
- [Getting Started Guide](https://miniapps.farcaster.xyz/docs/getting-started)
- [Examples](https://github.com/farcasterxyz/miniapps/tree/main/examples)

---

## 📊 Future Enhancements

### Tier System

- Animated moon phase transitions
- Tier-specific NFT metadata display
- Leaderboard by tier level
- Dynamic ASCII art based on holdings

### Technical

- Enhanced analytics for mini app usage
- Custom error tracking
- Performance optimization
- Additional blockchain integrations

### Design

- Complete theme consistency audit
- Lunar-themed loading states
- Enhanced ASCII art throughout
- Improved mobile UX

---

**Last Updated**: December 2024
**Documentation Version**: 1.0
**Next.js Version**: 15.5.6
**Monad Chain ID**: 143