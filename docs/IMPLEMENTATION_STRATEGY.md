# Moonynads Implementation Strategy

## Executive Summary
You have a strong foundation with animation infrastructure, token gating, and basic smart contracts. This document outlines how to evolve from **static → animated → generative** mechanics while maintaining performance and reliability.

---

## Strategic Rationale: Why This Order Matters

### The Funnel Approach

Traditional NFT drops often fail because they:
1. **Start with scarcity** (1/1 auctions first) → low participation = fails
2. **High prices early** → excludes community members
3. **No social proof** → why should anyone care?

**Your calendar inverts this:**

```
Day 13-16: Free/Low Cost + Challenges
├─ Build community (5,000+ members)
├─ Create social proof (FOMO building)
└─ Establish allowlist base

↓ PROVEN DEMAND ↓

Day 17-20: Moderate price + Interesting mechanics
├─ Test what resonates
├─ Reward early adopters
└─ Identify super-collectors

↓ VALIDATION ↓

Day 21-24: Premium + Scarcity + Auctions
├─ High-value collectors ready to spend
├─ Proven demand justifies premium pricing
└─ 1/1s sell based on proven value
```

### Key Business Logic

| Phase | Goal | Why It Works |
|-------|------|-------------|
| **13-16** | **Widen the net** | Free removes friction, challenges build engagement, no money risk = conversion |
| **17-20** | **Prove demand** | Moderate prices, repeat visitors = validation of real interest |
| **21-24** | **Monetize scarcity** | Whales spend big knowing community supports project |

**Result**: By Day 24, a $200M final bid is credible because you've proven:
- 5,000+ engaged participants
- 10,000 NFTs across mechanisms
- Real ecosystem integration
- Community voting/participation (not rug vibes)

---

## Phase 2 Completion: ✅ IMPLEMENTED

### Issue 1: Token Payment ✅ DONE

**Changed**: Replaced native MON payment with $m00nad token transfer

**Implementation**:
```solidity
// Added to Moonynads.sol:
IERC20 public m00nadToken;
uint256 public constant MINT_PRICE_M00NAD = 100_000_000;      // 100M
uint256 public constant DISCOUNT_PRICE_M00NAD = 50_000_000;   // 50M

// New mint function:
function mintAdventToken(uint256 day) external nonReentrant whenNotPaused {
    require(isAdventDay(day), "Invalid advent day");
    require(!adventTokenMinted[day][msg.sender], "Already minted for this day");
    require(adventDayMintCount[day] < ADVENT_DAILY_LIMIT, "Daily limit reached");
    
    require(
        m00nadToken.transferFrom(msg.sender, address(this), MINT_PRICE_M00NAD),
        "Token transfer failed"
    );
    
    _executeMint(day);
}
```

**Benefits**:
- ✓ Creates token utility (essential for $m00nad ecosystem)
- ✓ Treasury managed on-chain
- ✓ Incentivizes token holding
- ✓ Simpler than native currency handling

---

### Issue 2: Allowlist System ✅ DONE

**Implementation**:
```solidity
// Added to Moonynads.sol:
mapping(address => uint256) public allowlistTier;           // 0=none, 1=discount, 2=free
mapping(uint256 => mapping(address => bool)) public allowlistMinted;

function setAllowlist(address[] calldata addresses, uint256[] calldata tiers) 
    external onlyOwner 
{
    require(addresses.length == tiers.length, "Array length mismatch");
    for (uint256 i = 0; i < addresses.length; i++) {
        require(tiers[i] <= 2, "Invalid tier");
        allowlistTier[addresses[i]] = tiers[i];
    }
    emit AllowlistUpdated(addresses, tiers);
}

function mintAdventTokenAllowlist(uint256 day) external nonReentrant whenNotPaused {
    uint256 tier = allowlistTier[msg.sender];
    require(tier > 0, "Not on allowlist");
    
    // Tier 1: Pay discount (50M m00nad)
    if (tier == 1) {
        require(
            m00nadToken.transferFrom(msg.sender, address(this), DISCOUNT_PRICE_M00NAD),
            "Token transfer failed"
        );
    }
    // Tier 2: Free (no payment)
    
    allowlistMinted[day][msg.sender] = true;
    _executeMint(day);
}
```

**Features**:
- ✓ Three-tier system (None/Discount/Free)
- ✓ Per-user tracking (no double claiming)
- ✓ Batch management (up to contract gas limits)
- ✓ DRY: Single `_executeMint()` for all paths
- ✓ Events emitted for transparency

---

### Issue 3: Support Animated Content

**Current**: Static metadata only
**Target**: Support both static and animated NFTs

**Architecture Decision**: **Off-chain animation storage (IPFS) + minimal on-chain metadata**

**Why?**:
- Animation files (WebM) are 100KB-500KB each → expensive on-chain storage
- IPFS handles it perfectly with content addressing
- Metadata points to IPFS URL → gas efficient
- Animation settings stored off-chain with the file

**Implementation**:

```solidity
// Metadata structure (stays the same):
function tokenURI(uint256 tokenId) public view returns (string memory) {
    return super.tokenURI(tokenId); // Points to base_uri/{tokenId}.json
}

// The JSON metadata can include:
{
  "name": "Moonynad #1001",
  "description": "...",
  "image": "ipfs://Qm.../image.png",
  "animation_url": "ipfs://Qm.../animation.webm", // NEW
  "animation_settings": {
    "mode": "lineWave",
    "palette": "yellow",
    "speed": 1.5,
    "duration": 3
  }
}
```

**Frontend Changes**:
- Metadata API reads `animation_url` from JSON
- Component detects WebM presence → displays video player instead of static
- Graceful fallback: show preview image if animation unavailable

---

## Strategy: Classic vs Generative Mint

### Recommended Approach: **Hybrid Two-Day Strategy**

```
Day 13: CLASSIC ANIMATED MINT (User Records)
├─ Users mint hand-recorded ASCII animations
├─ Pricing: 100M m00nad (allowlist: 50M or free)
├─ Limit: 100 per day (curator picks best recordings)
└─ Mechanics: Upload recorder → preview → mint

Day 16-18: GENERATIVE MINT (Algorithm Generated)
├─ Server generates unique ASCII art variations
├─ Applied animation effect (e.g., all get same mode)
├─ Pricing: 100M m00nad
├─ Limit: Open edition or higher limit
└─ Mechanics: Deterministic generation from seed
```

**Why This Works**:
1. **Day 13 is intimate**: Users create their own animations → engagement + uniqueness
2. **Day 16+ is accessible**: Generated variants → no creation barrier
3. **Different appeal**:
   - Collectors want curated human recordings (Day 13)
   - Broader audience wants easy participation (Day 16+)
4. **Technical separation**: 
   - Day 13 = upload pipeline
   - Day 16 = generation pipeline

---

## Generation Approach: Best Practices

### Option A: **Deterministic Client-Side Generation** (Recommended for Phase 3)
```
User clicks Mint → Frontend generates unique ASCII from seedInput + tokenId
→ Display preview → User approves → Mint on-chain with animation settings
```
**Pros**: No server load, instant preview, gas efficient
**Cons**: Algorithm visible, limited complexity

### Option B: **Server-Side Generation + IPFS**
```
User clicks Mint → Backend generates variants → Store on IPFS → Mint with IPFS URL
```
**Pros**: Complex algorithms, server control
**Cons**: Server load, slightly higher latency, more deployment complexity

### Option C: **Hybrid: NFT.storage + Farcaster Integration**
```
Generation happens server-side, pinned to IPFS via NFT.storage
→ Automatic Farcaster cast on mint
→ Community votes on best generations
```
**Pros**: Decentralized, social integration, community engagement
**Cons**: Most complex implementation

---

## Day-by-Day Implementation Details

### Phase 1: Days 13-16 (Community Building)

**Day 13: Free Community Mint** ✅
- **What**: Free minting of animated ASCII (user uploads or gallery)
- **Why**: Removes barrier, creates immediate user base
- **Mechanics**:
  - 500 editions
  - No allowlist needed (first come, first served)
  - Users can upload their own animation or pick from curator gallery
  - Track addresses for allowlist qualification

**Day 14: Social Challenge** 🔧
- **What**: Free mints for Farcaster shares + Discord/Twitter verification
- **Why**: Drives organic marketing through participation
- **Implementation**:
  - OAuth with Farcaster/Discord/Twitter
  - Verify on-chain action (subscribe to channel, recast, etc.)
  - Issue allowlist badge to address
  - 250 editions, tracked per address
  
**Day 15: Ecosystem Integration** 🔧
- **What**: Free raffle for gaming ecosystem participants
- **Why**: Bridges m00n.app and M00nlander into this project
- **Implementation**:
  - Query m00n.app leaderboard API for top 50 players
  - Check M00nlander contract for game completion
  - Verify m00nynad token holders (25M+)
  - Issue free mint or raffle entry

**Day 16: First Paid Mint (Generative)** 💰
- **What**: 1000 edition generative ASCII variants
- **Why**: Validate if community will pay, introduce generative mechanic
- **Implementation**:
  - Pricing: 50M m00nad (low friction)
  - Allowlist pricing: 25M m00nad (reward Days 13-15 participants)
  - Generate unique ASCII from user seed + token ID
  - User picks animation mode
  - Test demand signal

---

### Phase 2: Days 17-20 (Mechanics Testing)

**Day 17: Community Voting** 🔧
- **What**: Community votes on winners, winners get NFTs
- **Why**: Test if voting mechanics work, drive engagement
- **Implementation**:
  - 6 curated ASCII pieces presented
  - Voting on Farcaster (cast reactions or dedicated poll)
  - Top 6 winners get NFT (free or 100M m00nad)
  - Record voting engagement metrics

**Day 18: Hybrid Generation** 🔧
- **What**: Algorithmic generation + user choice (animation mode)
- **Why**: Balance autonomy + reliability
- **Implementation**:
  - Server generates 250 unique ASCII variants
  - User selects 4 animation modes: lineWave, blockSway, colorCycle, glitch
  - Store animation settings in metadata
  - Pricing: 75M m00nad (test demand at mid-tier)

**Day 19: Collective Challenge** 🔧
- **What**: Community goal (trading volume, holders, activity)
- **Why**: Test cooperation mechanics
- **Implementation**:
  - Set ecosystem target (e.g., 100M daily trading volume)
  - Track via Monad chain data
  - If goal met by Day 19 midnight: Airdrop bonus free NFT
  - If not met: 100M m00nad holders can still mint (but no bonus)

**Day 20: Creator Tribute (Airdrop)** ✨
- **What**: Free NFT to all previous participants
- **Why**: Celebrate growth, reward loyalty
- **Implementation**:
  - Snapshot all addresses that minted Days 13-19
  - Airdrop 1 edition to each address
  - Special metadata: "Lunar Builder" badge
  - No cost to collectors

---

### Phase 3: Days 21-24 (Premium & Scarcity)

**Day 21: Whale Tier** 💎
- **What**: Premium exclusive for 500M+ m00nad holders
- **Why**: Validate whale demand, create aspirational tier
- **Implementation**:
  - 25 editions maximum
  - 250M m00nad per mint
  - Require 500M+ holdings (check at mint time)
  - Bonus: Lifetime trading discount token (emit separate ERC20 or in NFT metadata)

**Day 22: Mystery Box** 🎁
- **What**: Blind mint, rarity revealed later
- **Why**: Gamification element, creates reveal excitement
- **Implementation**:
  - 50 editions
  - 150M m00nad per mint (gamble premium)
  - Rarity tiers: 1 Legendary, 5 Epic, 15 Rare, 29 Uncommon
  - Randomize via commit-reveal or VRF at Day 24
  - Reveal timer: locked until Dec 24 00:00 UTC

**Day 23: Dutch Auction 1/1** 🏛️
- **What**: Single ultra-rare 1/1, descending price auction
- **Why**: Price discovery, winner prestige
- **Implementation**:
  - 1 edition only
  - Start: 500M m00nad
  - End: 50M m00nad (24 hour linear descent)
  - Winner: Featured on site, custom profile page
  - Mechanic: First buyer at any price wins

**Day 24: Triple Finale** 🎉
- **Part 1 (Free Completion)**: 5000 editions, free to all participants
  - Collaborative celebration ASCII piece
  - Everyone who participated gets one
  - Creates inclusive sense of collective journey

- **Part 2 (Set Bonus)**: 100 editions, 200M m00nad
  - Requirement: Own at least 1 NFT from each day (13-24)
  - Special golden edition with achievement metadata
  - Proves complete collector status

- **Part 3 (Ultimate 1/1)**: 1 edition, English auction
  - Start: 50M m00nad, 24 hour duration
  - Winner gets:
    - NFT + physical framed print
    - Lifetime special Discord role
    - Name in contract comments (immortalized)
    - Optional: Collaboration commission for next year

---

## Recommended Implementation Priority

### Phase 2.1 (Week 1): Core Upgrades
- [ ] Modify Moonynads.sol to accept $m00nad token payment
- [ ] Add allowlist infrastructure (simple mapping first)
- [ ] Deploy on Monad testnet for testing
- [ ] Update metadata schema to support `animation_url`

### Phase 2.2 (Week 2): Animation Support
- [ ] Update metadata API to include animation_url field
- [ ] Create VideoNFT display component (replaces static image)
- [ ] Test with existing animation recorder uploads
- [ ] Document animation metadata format

### Phase 2.3 (Week 3): Allowlist & UI
- [ ] Build allowlist management dashboard
- [ ] Update mint UI to show pricing based on allowlist tier
- [ ] Test allowlist free mints
- [ ] Add toasts/notifications for allowlist status

### Phase 2.4 (Week 4): Animation Foundation
**Priority**: Ensure animation infrastructure is ready for Days 13-24
- [ ] **Animation Modes Verification**
  - Verify all 7 modes work in production (still, lineWave, blockSway, colorCycle, glitch, frameCycle, svgWave)
  - Test rendering performance at 60+ FPS with preview grids
  - Validate all 4 color palettes (yellow, green, blue, rainbow)
  
- [ ] **Recording Pipeline**
  - Test WebM encoding with varying FPS (1-12)
  - Validate output sizes (50-100KB target)
  - Test IPFS upload integration end-to-end
  - Validate metadata persistence in JSON
  
- [ ] **Animation Studio** (`/pants`)
  - Verify 13 ASCII designs load correctly
  - Test LocalStorage persistence across reloads
  - Test frame sequence support (e.g., hips-frame-{1,2,3,4}.txt)
  - Validate download functionality

---

### Phase 3.1 (Week 5): Generative Mint
- [ ] Build deterministic ASCII generator (client-side or server-side)
- [ ] Create seed generation from user input
- [ ] Animation mode selector for generated pieces
- [ ] Preview + approve flow before minting
- [ ] Test generation consistency (same seed = same output)

---

## Implemented Components

### ✅ Solidity Contract (`blockchain/Moonynads.sol`)
- Token payment system via ERC20 transfers
- Three-tier allowlist (none/discount/free)
- Batch allowlist management function
- Per-user + per-day mint tracking
- All state variables properly initialized

### ✅ Config Update (`lib/contracts.ts`)
- Updated ABI with new functions
- New payment constants
- Allowlist tier configuration
- Single source of truth for pricing

### ✅ Hook (`hooks/use-allowlist.ts`)
- Utility function for tier information
- Price calculation based on tier
- Type-safe tier handling

### ✅ Admin Component (`components/allowlist-manager.tsx`)
- CSV parser for batch imports
- Visual preview of entries
- Error handling and validation
- Transaction submission UI
- Lunar-themed styling

---

## File Structure - Updated

```
blockchain/
└── Moonynads.sol                   # ✅ Contract with token + allowlist

components/
├── allowlist-manager.tsx           # ✅ Admin UI for allowlist
└── (existing components)

hooks/
├── use-allowlist.ts                # ✅ Allowlist hook
└── (existing hooks)

lib/
├── contracts.ts                    # ✅ Updated ABI + config
└── (existing libs)

docs/
├── IMPLEMENTATION_STRATEGY.md      # ✅ This file
└── ROADMAP.md                      # ✅ Roadmap updated
```

---

## Integration Checklist

- [x] Contract accepts $m00nad token payment
- [x] Allowlist tier system implemented
- [x] Admin management function added
- [x] ABI updated in contracts.ts
- [x] Configuration constants added
- [x] Allowlist hook created
- [x] Admin UI component built
- [ ] Deploy contract to Monad testnet
- [ ] Test with sample allowlist entries
- [ ] Build public mint UI (next phase)
- [ ] Integration test with frontend
- [ ] Final audit before mainnet

---

## Technical Decisions Summary

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Payment Token** | $m00nad only | Ecosystem utility, no native currency complexity |
| **Animation Storage** | IPFS (NFT.storage or Arweave) | Content-addressed, permanent, gas efficient |
| **Animation Metadata** | Off-chain in JSON | Flexible, no size constraints |
| **Allowlist** | Simple mapping (upgrade to Merkle if 10k+) | Easy to manage, sufficient for launch |
| **Generation** | Client-side deterministic first | Fast, scalable, no server load |
| **Day 13** | Classic animated (user uploads) | Engagement + authenticity |
| **Day 16/18** | Generative variants | Accessibility + volume |

---

## Contract Modifications Checklist

- [ ] Import IERC20
- [ ] Add m00nadToken state variable
- [ ] Modify constructor to accept token address
- [ ] Add allowlistTier mapping
- [ ] Create setAllowlist() function
- [ ] Update mintAdventToken() to check allowlist first
- [ ] Create mintAdventTokenAllowlist() for free/discount tiers
- [ ] Add token transfer calls with proper error handling
- [ ] Update metadata to include animation_url field
- [ ] Add events for allowlist operations

---

## Next Steps

1. **Review & Approve**: Confirm this strategy aligns with your vision
2. **Contract Implementation**: Start with token payment + allowlist
3. **Animation UX**: Build video preview component
4. **Testing**: Deploy to testnet with sample animations
5. **Generative Prep**: Begin ASCII generation algorithm (can run in parallel)

---

## Critical Success Factors for Each Phase

### Phase 1 (Days 13-16): Community Building

✅ **Marketing**: Launch 72 hours before Day 13
- Farcaster campaign: "Join the lunar movement - FREE NFTs"
- Twitter threads: Explain each day's mechanics
- Discord announcements: Community countdown

✅ **Technical Readiness**:
- [ ] Day 13 contract deployed + tested
- [ ] OAuth integrations working (Discord, Twitter, Farcaster)
- [ ] m00n.app API integration verified
- [ ] Allowlist tracking system operational

✅ **Community Building**:
- [ ] Discord server active with live channels
- [ ] Farcaster cast framework ready
- [ ] Email list captured (optional)
- [ ] Community mods recruited

---

### Phase 2 (Days 17-20): Mechanics Testing

✅ **Analytics Ready**:
- [ ] Track voting engagement (Farcaster/Discord metrics)
- [ ] Monitor generation algorithm performance
- [ ] Record community challenge progress
- [ ] Measure repeat participation rates

✅ **Feedback Loop**:
- [ ] Daily community surveys (Discord polls)
- [ ] Metrics dashboard visible to core team
- [ ] Ready to pivot if mechanic underperforms
- [ ] Clear go/no-go decision points

---

### Phase 3 (Days 21-24): Monetize & Close

✅ **Whale Outreach**:
- [ ] Identify top m00nad holders
- [ ] Personal outreach (DM/Discord) before Day 21
- [ ] Explain scarcity positioning
- [ ] Reserve spots (if desired)

✅ **Media Blitz**:
- [ ] Day 22: Mystery box reveal expectations
- [ ] Day 23: Live auction streaming setup
- [ ] Day 24: Final celebration + results story
- [ ] Post-mortem: Share success metrics publicly

---

## Marketing Timeline

```
Week 1 (Launch Week): Community Building Blitz
├─ Pre-launch (Dec 12): Teaser campaign
├─ Day 13: "Free NFT drop!" marketing
├─ Day 14: "Social challenge" engagement push
├─ Day 15: "Ecosystem integration" ecosystem collab
└─ Day 16: "First paid day - test demand" analytics focus

Week 2 (Mechanics Testing): Engagement & Iteration
├─ Day 17: Voting campaign + live results
├─ Day 18: Generation showcase + user testings
├─ Day 19: Community challenge progress updates
└─ Day 20: "We grew 5000+ collectors!" celebration

Week 3 (Premium & Close): FOMO & Exclusivity
├─ Day 21: Whale tier prestige marketing
├─ Day 22: Mystery reveal hype
├─ Day 23: Live auction streaming + bidding updates
└─ Day 24: Final celebration + year-round planning
```

---

## Quick Decision Tree: What to Build First

```
1. Do you have the $m00nad token payment ready?
   └─ NO → Start with Issue 1: Token Payment (Solidity)
   └─ YES → Move to next

2. Do you have allowlist infrastructure?
   └─ NO → Implement simple mapping + setAllowlist()
   └─ YES → Move to next

3. Can you display animations on the frontend?
   └─ NO → Update metadata API to support animation_url
   └─ YES → You're ready to start implementation!
```

---

## File Manifest for New Components

Create these during Phase 2.1-2.3:

```
Core Contract Changes:
├── blockchain/Moonynads.sol (modified)
├── blockchain/Moonynads_AllowlistMixin.sol (NEW - optional)
└── blockchain/script/deployment.ts (NEW)

Frontend Components:
├── components/mint/
│   ├── page.tsx (NEW - main mint interface)
│   ├── phases/
│   │   ├── phase1-community.tsx (FREE/LOW)
│   │   ├── phase2-testing.tsx (MODERATE)
│   │   └── phase3-exclusive.tsx (PREMIUM)
│   ├── token-payment.tsx (NEW - $m00nad handling)
│   └── video-player.tsx (NEW - animation preview)
└── components/animations/
    ├── preview.tsx (NEW)
    └── metadata-display.tsx (NEW)

API Endpoints:
├── app/api/mint/
│   ├── route.ts (NEW)
│   └── verify-allowlist.ts (NEW)
├── app/api/metadata/[tokenId]/
│   └── route.ts (MODIFIED - add animation_url)
└── app/api/generate/
    └── ascii.ts (NEW - generative endpoint)

Hooks & Utilities:
├── hooks/useMintPhase.ts (NEW)
├── hooks/useAllowlistStatus.ts (NEW)
├── lib/generate/ascii-generator.ts (NEW)
└── lib/animation/metadata-schema.ts (NEW)
```

---

## Next Steps (In Order)

1. **Week 1**: Core contract modifications
   - Add $m00nad token payment
   - Add allowlist system
   - Deploy to Monad testnet
   - Test with sample addresses

2. **Week 2**: Frontend animation support
   - Update metadata API for animation_url
   - Build video player component
   - Test with your existing animation uploads
   - Deploy to preview environment

3. **Week 3**: Allowlist & UI
   - Build allowlist dashboard
   - Create day-specific mint interfaces
   - Add tier indicators
   - Finalize marketing assets

4. **Week 4**: Generative engine
   - Build deterministic ASCII generator
   - Create seed generation
   - Test preview before mint
   - Finalize for Day 16 launch

Ready to proceed? I recommend starting with **Week 1: Core contract modifications**. Should I begin implementing the token payment system?
