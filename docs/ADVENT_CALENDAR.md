# 🎄 Moonynads Advent Calendar Strategy

## 🎯 Strategic Framework: Widen → Test → Monetize

### Phase 1: Community Building (Days 13-16)
**Goal**: Maximum participation, social proof, allowlist growth
- **Free/Low-cost entry** removes barriers
- **High accessibility** builds community base
- **Social mechanics** drive organic growth

### Phase 2: Mechanics Testing (Days 17-20)
**Goal**: Demand validation, identify resonant mechanics
- **Moderate pricing** tests willingness to pay
- **Interesting designs** validate creative direction
- **Community feedback** informs premium phase

### Phase 3: Scarcity & Exclusivity (Days 21-24)
**Goal**: Monetize proven demand, create FOMO
- **Premium pricing** for validated demand
- **Limited supply** creates urgency
- **High-value collectors** drive revenue

## 📅 Daily Implementation Matrix

### Days 13-16: Community First
| Day    | Edition    | Price          | Mechanic              | Animation Control | Purpose           | Status         |
| ------ | ---------- | -------------- | --------------------- | ----------------- | ----------------- | -------------- |
| **13** | 500        | **FREE**       | Classic recordings    | ⭐⭐⭐⭐⭐ Full   | Community entry   | ✅ **READY**   |
| **14** | 250        | **FREE**       | Social challenge      | ⭐ Static preset  | Organic marketing | 🔄 In Progress |
| **15** | 100+raffle | **FREE**       | Ecosystem integration | ⭐⭐ Limited      | Cross-platform    | 📋 Planned     |
| **16** | 1000       | **50M m00nad** | Generative variants   | ⭐⭐⭐⭐ Hybrid   | Demand validation | 🔄 In Progress |

✅ ASCII Deterministic Generator COMPLETE - Foundation unlocked for Days 13-16

### Days 17-20: Mechanics Testing
| Day    | Edition   | Price           | Mechanic             | Animation Control       | Purpose          |
| ------ | --------- | --------------- | -------------------- | ----------------------- | ---------------- |
| **17** | 6 winners | 100M/Free       | Community voting     | ⭐ Curated              | Engagement test  |
| **18** | 250       | **75M m00nad**  | Hybrid generation    | ⭐⭐⭐⭐ User+Algorithm | Autonomy test    |
| **19** | Variable  | **100M m00nad** | Collective challenge | ⭐⭐⭐ Conditional      | Cooperation test |
| **20** | 1000      | **FREE**        | Loyalty airdrop      | ⭐⭐ Special            | Retention reward |

### Days 21-24: Premium & Scarcity
| Day    | Edition    | Price                 | Mechanic        | Animation Control   | Purpose            |
| ------ | ---------- | --------------------- | --------------- | ------------------- | ------------------ |
| **21** | 25         | **250M m00nad**       | Whale exclusive | ⭐⭐⭐⭐⭐ Ultimate | High-value capture |
| **22** | 50         | **150M m00nad**       | Mystery box     | ⭐ Hidden           | Gamification       |
| **23** | 1          | **500M→50M**          | Dutch auction   | ⭐⭐⭐⭐⭐ Ultimate | Price discovery    |
| **24** | 5000+100+1 | **FREE/200M/Auction** | Triple finale   | ⭐-⭐⭐⭐⭐⭐ Mixed | Grand finale       |

## 💰 Pricing Strategy

### Token Payment System ($m00nad)
- **Replaces native MON** for ecosystem utility
- **Three-tier allowlist**: None (100M) / Discount (50M) / Free (0M)
- **Treasury management** on-chain
- **Batch allowlist management** for efficiency

### Psychological Pricing
- **Day 13-15**: Free removes friction
- **Day 16**: 50M (low barrier, demand test)
- **Day 17-20**: 75-100M (moderate, validation)
- **Day 21-24**: 150M+ (premium, proven demand)

## 🎮 Animation Control Levels

### ⭐ Static Preset (No Choice)
- Pre-determined animation settings
- Used for curated/special pieces
- Ensures consistency across editions

### ⭐⭐ Limited Modes
- Restricted animation mode selection
- Basic parameter control
- Suitable for conditional rewards

### ⭐⭐⭐ Standard Customization
- Full mode selection (7 options)
- Speed and amplitude controls
- Palette selection available

### ⭐⭐⭐⭐ Hybrid Generation
- User selects from generated variants
- Algorithm + user choice combination
- Balances creativity + accessibility

### ⭐⭐⭐⭐⭐ Full Access
- Complete customization freedom
- All modes, palettes, parameters
- Ultimate creative expression

## 🏗️ Implementation Requirements

### Smart Contract Enhancements
```solidity
// Token payment system
IERC20 public m00nadToken;
uint256 public constant MINT_PRICE_M00NAD = 100_000_000;
uint256 public constant DISCOUNT_PRICE_M00NAD = 50_000_000;

// Three-tier allowlist
mapping(address => uint256) public allowlistTier; // 0=none, 1=discount, 2=free
```

### Daily Component Architecture
```
components/mint/
├── day-13-free.tsx          // Classic recordings
├── day-14-social.tsx        // Social challenge
├── day-15-ecosystem.tsx     // Ecosystem integration
├── day-16-generative.tsx    // Generative variants
├── day-17-voting.tsx        // Community voting
├── day-18-hybrid.tsx        // Hybrid generation
├── day-19-challenge.tsx     // Collective challenge
├── day-20-tribute.tsx       // Loyalty airdrop
├── day-21-whale.tsx         // Whale exclusive
├── day-22-mystery.tsx       // Mystery box
├── day-23-auction.tsx       // Dutch auction
└── day-24-finale.tsx        // Triple finale
```

## 📈 Success Metrics by Phase

### Phase 1 Targets (Days 13-16)
- **5,000+** cumulative community members
- **2,000+** free/allowlist mints
- **1,000+** Day 16 demand validation
- **500+** social challenge participations

### Phase 2 Targets (Days 17-20)
- **300+** voting participants (Day 17)
- **60%+** generative mechanic adoption
- **50%+** community challenge completion
- **3,000+** Day 20 airdrop reach

### Phase 3 Targets (Days 21-24)
- **90%+** whale tier mint rate
- **100%** mystery box sellout
- **80%+** of starting bid (Dutch auction)
- **50%+** complete set bonus claims

## 🚀 Build Priority (Critical Path)

### Phase A: Foundation (Ready by Day 6)
1. ASCII Deterministic Generator
2. Animation Preview + Configurator
3. Enhanced Recording UI
4. Metadata Builder

### Phase B: Days 13-16 (Ready by Day 13)
1. Day 13 Free Mint Component
2. Day 16 Generative Component
3. Generic Mint Page Template

### Phase C: Showcase System (Ready by Day 16)
1. Animation Gallery Component
2. Showcase Day Pages
3. Collector Portfolio Pages

**Total Timeline**: ~5-6 weeks with focused development