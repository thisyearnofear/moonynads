# 🌙 Moonynads Roadmap

## Project Vision
Moonynads is pioneering the future of interactive NFT experiences by combining ASCII art, blockchain technology, and innovative minting mechanics. Our goal is to create the most engaging advent calendar experience in crypto while strengthening the m00nynad ecosystem on Monad blockchain.

## 🎯 Core Principles
- **Community First**: Every decision prioritizes ecosystem growth
- **Innovation Over Convention**: Novel mechanics over standard mints
- **Cross-Platform Integration**: Leverage entire Moonverse ecosystem
- **Accessibility**: Multiple price points and engagement methods
- **Quality**: Each piece is curated ASCII art with genuine artistic value

---

## 📅 Development Phases

### **Phase 1: Foundation** ✅ COMPLETED
*Status: Live at [m00nynads.vercel.app](https://m00nynads.vercel.app)*

#### Deliverables
- [x] ASCII art gallery with 13 unique lunar pieces
- [x] Responsive web interface with lunar theme
- [x] Moonverse ecosystem showcase
- [x] m00nynad token integration and branding
- [x] Basic advent calendar UI structure
- [x] Comprehensive footer with network information

#### Technical Stack
- Next.js 15 with TypeScript
- Tailwind CSS for consistent styling
- Vercel deployment pipeline
- Mobile-optimized responsive design

---

### **Phase 2: Blockchain Infrastructure** ✅ 90% COMPLETED
*Target: January 2024*

#### Smart Contract Development
- [x] **Core NFT Contract** (`Moonynads.sol`) ✨ ENHANCED
  - ERC721 with enumerable and metadata extensions ✓
  - Advent calendar minting mechanics ✓
  - Pausable and ownable security features ✓
  - Rarity calculation system ✓
  - **$m00nad token payment system** ✅ NEW
  - **Three-tier allowlist (discount/free)** ✅ NEW
  - **Batch allowlist management** ✅ NEW

- [ ] **Auction System** (`MoonynadsAuction.sol`)
  - Dutch auction implementation
  - English auction with automatic settlement
  - Minimum bid validation and reserve prices

- [ ] **Raffle System** (`MoonynadsRaffle.sol`)
  - Verifiable random selection using Chainlink VRF
  - Token-weighted entry system
  - Automatic prize distribution

#### Web3 Integration
- [x] **Wallet Connection**
  - MetaMask integration with Wagmi v2 ✓
  - Automatic Monad network detection and switching ✓
  - Connection state persistence ✓

- [x] **Token Gating System**
  - Real-time m00nynad balance verification ✓
  - Graduated access tiers for different balance levels ✓
  - Hook-based access management system ✓

- [x] **Contract Interactions**
  - $m00nad token transfer handling ✓
  - Allowlist tier verification ✓
  - Ownership verification logic ✓

#### API Development
- [x] **Metadata Service** (Complete)
  - Dynamic metadata generation for each token ✓
  - Attribute and rarity calculation engine ✓
  - Memetoken and network metadata integration ✓

- [x] **Image Generation**
  - SVG creation from ASCII art files ✓
  - Dynamic styling and token ID embedding ✓
  - Lunar-themed visual styling ✓

#### Admin Tools
- [x] **Allowlist Manager UI** ✅ NEW
  - CSV import functionality
  - Batch tier assignment
  - Visual preview before submission
  - Transaction tracking

---

### **Phase 3: Community-First Advent Calendar** 🔄 IN PROGRESS
*Strategy: Widen → Test → Monetize (Free/Challenges → Mechanics → Scarcity)*

#### Advent Calendar Philosophy
The calendar is designed as a **three-phase funnel**:
1. **Days 13-16: COMMUNITY BUILDING** (Free/Low-Cost, High Accessibility)
   - Goal: Maximum participation, social proof, allowlist growth
   - Mechanics: Free mints, challenges, ecosystem integration
   
2. **Days 17-20: MECHANICS TESTING** (Moderate Price, Interesting Designs)
   - Goal: Demand validation, identify what works
   - Mechanics: Generative variants, voting, challenges
   
3. **Days 21-24: SCARCITY & EXCLUSIVITY** (High Value, Limited Supply)
   - Goal: FOMO, high-value collectors, proven demand
   - Mechanics: Auctions, whale tiers, 1/1 ultimates

---

#### Daily Mechanics Implementation

### Animation Infrastructure (Phase 2.5: Foundation ✅)
The following animation capabilities are **production-ready**:

**Animation Engine**:
- 7 modes: `still`, `lineWave`, `blockSway`, `colorCycle`, `glitch`, `frameCycle`, `svgWave`
- 4 color palettes: `yellow`, `green`, `blue`, `rainbow`
- Advanced effects: speed (0-3), amplitude (0-24), gradient overlays, character targeting
- Canvas rendering: 60+ FPS capable, real-time preview

**Recording & Upload Pipeline**:
- Canvas stream capture (WebM output, 50-100KB per animation)
- IPFS integration with metadata persistence
- Upload API validation and error handling

**Animation Studio** (`/pants`):
- 13 selectable ASCII designs with live preview
- Full parameter controls (sliders for speed, amplitude, palette selection)
- LocalStorage persistence per design
- Frame sequence support for multi-frame animations

**Metadata Format**:
```typescript
{
  "animation_url": "ipfs://...",      // WebM video
  "animation_settings": {
    "mode": "lineWave",
    "palette": "yellow",
    "speed": 1.5,
    "amplitude": 12,
    "gradient": true,
    "targetChar": ""
  }
}
```

---

## PHASE 1: COMMUNITY BUILDING (Days 13-16)

##### **December 13: Free Community Mint** ✅ READY
- [x] 500 edition open mint
- [x] **FREE** (removes barrier to entry)
- [x] Animated classic ASCII recordings
- [ ] Marketing: "Join the lunar movement" push
- **Animation Control**: ⭐⭐⭐⭐⭐ Full customization
  - Users select: design, animation mode, palette, speed, amplitude
  - Record via canvas → upload to IPFS
  - All 7 animation modes available
  - All 4 color palettes available

##### **December 14: Social Challenge Mint** 🚧 PLANNED
- [ ] 250 editions
- [ ] **FREE for verified engagement:**
  - Farcaster cast share
  - Discord join + verification
  - Twitter follow + on-chain verification
- [ ] Build allowlist for future days
- **Animation Control**: ⭐ Static preset (no customization)

##### **December 15: Ecosystem Builder Raffle** 🚧 PLANNED
- [ ] 100 guaranteed + raffle entries
- [ ] **FREE for:**
  - Top 50 m00n.app players
  - M00nlander completionists
  - 25M+ m00nynad holders
- [ ] Raffle slots for general community
- **Animation Control**: ⭐⭐ Limited modes only (blockSway, still)

##### **December 16: Generative Community Edition** 🚧 PLANNED
- [ ] 1000 edition open mint
- [ ] **50M m00nad** (first paid day, low entry)
- [ ] Generative ASCII variants (algorithm-unique via deterministic seed)
- [ ] **Allowlist: 25M m00nad** (reward early participants)
- **Animation Control**: ⭐⭐⭐⭐ User selects from all modes + full customization

---

## PHASE 2: MECHANICS TESTING (Days 17-20)

##### **December 17: Community Voting Contest** 🚧 PLANNED
- [ ] 6 winner editions
- [ ] **100M m00nad** or **FREE for verified votes**
- [ ] Community voting determines winners via Farcaster
- [ ] Test voting engagement
- **Animation Control**: ⭐ Curated preset (no user choice)

##### **December 18: Generative Variants II** 🚧 PLANNED
- [ ] 250 edition algorithmic generation
- [ ] **75M m00nad** (moderate price)
- [ ] Users pick animation mode before mint
- [ ] Each NFT: unique generated ASCII + chosen animation
- **Animation Control**: ⭐⭐⭐⭐ Hybrid generation (user + algorithm)

##### **December 19: Collective Community Challenge** 🚧 PLANNED
- [ ] 100-500 editions (goal-dependent)
- [ ] **100M m00nad** to participate
- [ ] Ecosystem goal (trading volume, activity)
- [ ] If goal met: Free bonus airdrop to all participants
- **Animation Control**: ⭐⭐⭐ Standard if goal unmet, Premium (colorCycle + gradient) if goal met

##### **December 20: Creator Tribute (Free Airdrop)** 🚧 PLANNED
- [ ] 1000 free edition airdrop
- [ ] **FREE** to all Day 13-19 holders
- [ ] Honors ecosystem builders
- [ ] Celebrates growth checkpoint
- **Animation Control**: ⭐⭐ Special curated glitch animation (locked, celebratory)

---

## PHASE 3: SCARCITY & EXCLUSIVITY (Days 21-24)

##### **December 21: Whale Exclusive Premium** 🚧 PLANNED
- [ ] 25 edition ultra-premium
- [ ] **250M m00nad** per mint
- [ ] **Requirement: 500M+ m00nad holdings**
- [ ] Custom commissioned ASCII art
- [ ] Lifetime trading discount token (meta-utility)
- **Animation Control**: ⭐⭐⭐⭐⭐ Full access (all modes, all palettes, custom parameters)

##### **December 22: Mystery Box (Blind Mint)** 🚧 PLANNED
- [ ] 50 edition blind mint
- [ ] **150M m00nad** (gamble premium)
- [ ] Reveal rarity post-mint (1 Legendary, 5 Epic, 15 Rare, 29 Uncommon)
- [ ] Reveal locked until December 24
- **Animation Control**: ⭐ Hidden until reveal (1L: glitch+rainbow | 5E: colorCycle | 15R: lineWave | 29U: still)

##### **December 23: Dutch Auction (1/1 Rare)** 🚧 PLANNED
- [ ] Single ultra-rare 1/1 edition
- [ ] Price: **500M m00nad → 50M m00nad** (24 hour decrease)
- [ ] 24-hour auction window
- [ ] Winner gets custom piece + featured profile
- **Animation Control**: ⭐⭐⭐⭐⭐ Ultimate customization (all modes, all palettes, full parameters)

##### **December 24: Triple Finale Celebration** 🚧 PLANNED

**Part 1: Community Completion (FREE)**
- 5000 editions, free to all participants
- Collaborative celebratory ASCII piece
- Proof of full journey
- **Animation Control**: ⭐⭐ Preset (lineWave + gradient + rainbow, locked)

**Part 2: Collector Set Bonus (LIMITED)**
- 100 editions, **200M m00nad**
- Requirement: 1 NFT from each day (13-24)
- Golden edition with achievement metadata
- Bragging rights + rarity
- **Animation Control**: ⭐⭐⭐ Golden set (colorCycle + gradient, customizable speed/amplitude)

**Part 3: Ultimate 1/1 Auction (FINAL)**
- The "Celestial Whale" - final 1/1 ever
- English auction, 50M m00nad starting bid
- Winner receives:
  - Ultimate 1/1 NFT
  - Custom framed physical print
  - Lifetime special Discord role
  - Name immortalized in contract comments
- **Animation Control**: ⭐⭐⭐⭐⭐ Total freedom (all modes, all palettes, custom parameters)

#### Technical Requirements
- [ ] **Multi-Contract Architecture**
  - Modular system for different mechanics
  - Secure admin controls and timelock systems
  - Inter-contract communication protocols

- [ ] **External Integrations**
  - Gaming platform API connections
  - Social media monitoring systems
  - Chainlink oracles for external data

- [x] **Basic UI Components**
  - Advent calendar interface ✓
  - Token gating display ✓
  - Wallet connection UI ✓

- [ ] **Advanced UI Components**
  - Real-time auction interfaces
  - Tournament leaderboards
  - Social contest voting systems
  - Mystery box reveal animations

---

### **Phase 4: Ecosystem Expansion** 🌌 FUTURE
*Target: Q2 2025*

#### Cross-Platform Features
- [ ] **M00nCabal Integration**
  - Cabal member exclusive drops
  - Governance participation rewards
  - Special membership benefits

- [ ] **Gaming Rewards System**
  - Persistent achievement tracking
  - Cross-game reward mechanisms
  - Seasonal tournament circuits

- [ ] **Social Features**
  - Collector profile pages
  - Trading and marketplace integration
  - Community showcase galleries

#### Advanced Mechanisms
- [ ] **Dynamic Rarity System**
  - Evolving traits based on holder behavior
  - Community voting on attribute changes
  - Seasonal aesthetic updates

- [ ] **Utility Integration**
  - Profile picture generation tools
  - Merchandise and physical goods
  - Virtual gallery experiences

- [ ] **Governance Features**
  - Community voting on future drops
  - Artist collaboration selection
  - Ecosystem fund allocation

---

## 🔧 Technical Architecture

### **Smart Contract Stack**
```
├── Moonynads.sol (Core NFT with multi-mechanics)
├── MoonynadsAuction.sol (Dutch & English auctions)
├── MoonynadsRaffle.sol (Verifiable random selection)
├── MoonynadsGovernance.sol (Community voting)
└── MoonynadsRegistry.sol (Cross-contract coordination)
```

### **Frontend Architecture**
```
├── /components
│   ├── /advent (Daily mechanism components)
│   ├── /web3 (Blockchain interaction)
│   ├── /gallery (Collection display)
│   └── /moonverse (Ecosystem integration)
├── /hooks (Custom React hooks for Web3)
├── /lib (Utilities and configurations)
└── /api (Metadata and image generation)
```

### **Infrastructure Stack**
- **Blockchain**: Monad Mainnet (Chain ID: 143)
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom lunar theme
- **Web3**: Wagmi v2, Viem, TanStack Query
- **Storage**: IPFS for metadata, Vercel for hosting
- **Analytics**: Custom tracking for engagement metrics

---

## 📊 Success Metrics

### **Phase 1 Targets** ✅ COMPLETED
- [x] Website launch with full responsive design
- [x] Moonverse ecosystem documentation
- [x] Community engagement and social presence

### **Phase 2 Targets** 🔄 IN PROGRESS - 90% COMPLETE

**Completed**:
- [x] Core smart contracts enhanced (token payment + allowlist)
- [x] Wallet integration and network switching functional
- [x] Token gating system with tiered access implemented
- [x] Allowlist manager UI ready
- [x] Payment configuration constants set

**Remaining**:
- [ ] Deploy contract to Monad testnet
- [ ] Test with sample allowlist data
- [ ] 1,000+ wallet connections in first week
- [ ] 500+ token-gated gallery access users
- [ ] Zero critical security vulnerabilities (pre-audit checklist)
- [ ] Sub-2-second transaction confirmation times

### **Phase 3 Targets** 🔄 COMMUNITY-FIRST STRATEGY

**Days 13-16 (Community Building Phase)**
- [ ] 5,000+ cumulative community members registered
- [ ] 2,000+ free/allowlist mints (Days 13-15)
- [ ] 1,000+ demand validation via Day 16 generative mint
- [ ] 500+ social challenge participations
- [ ] 100+ ecosystem builder qualifications

**Days 17-20 (Mechanics Testing Phase)**
- [ ] 300+ voting participants (Day 17)
- [ ] 60%+ of community attempts generative mechanic (Day 18)
- [ ] 50%+ community challenge goal completion (Day 19)
- [ ] Day 20 airdrop reaches 3,000+ holders
- [ ] Average 4+ unique NFTs per active collector

**Days 21-24 (Scarcity & Exclusivity Phase)**
- [ ] Whale tier 90%+ mint rate (proven demand signal)
- [ ] Mystery box all 50 editions sold
- [ ] Dutch auction final price 80%+ of starting bid (strong demand)
- [ ] Complete set bonus 50%+ claimed (loyalty incentive working)
- [ ] Ultimate 1/1 auction final bid 200M+ m00nad

**Overall Success Metrics**
- [ ] 10,000+ total NFTs minted across all days
- [ ] 5,000+ unique wallets participated
- [ ] 3,000+ m00nad tokens earned by ecosystem
- [ ] 95%+ successful transaction completion rate
- [ ] Zero exploit attempts or vulnerabilities

### **Phase 4 Targets** 🌌 FUTURE
- [ ] Cross-ecosystem integration with 5+ platforms
- [ ] 1M+ m00nynad tokens in ecosystem circulation
- [ ] 24/7 community activity and engagement
- [ ] Sustainable creator economy establishment

---

## 🤝 Community & Ecosystem

### **Builder Engagement**
- Open-source components for ecosystem developers
- Documentation and integration guides
- Developer grants and collaboration opportunities
- Regular ecosystem updates and showcases

### **Collector Community**
- Discord/Farcaster community management
- Regular AMA sessions and updates
- Collector showcase and featured galleries
- Early access programs for active members

### **Cross-Platform Synergy**
- **m00n.app**: Tournament score integration
- **M00nlander**: Achievement-based rewards
- **M00nCabal**: Exclusive member benefits
- **Future Apps**: Plugin architecture for new integrations

---

## 🔮 Long-Term Vision

Moonynads aims to become the premier example of how NFT projects can transcend simple PFP collections to become living, breathing ecosystem experiences. By pioneering multi-mechanic drops, cross-platform integration, and community-driven governance, we're building the foundation for the next generation of blockchain-native cultural experiences.

Our success will be measured not just in sales or floor prices, but in the vibrancy of the community we build, the innovation we bring to the space, and the value we create for the entire m00nynad ecosystem.

**The moon is just the beginning.** 🌙✨

---

## 📞 Contact & Contributions

- **Website**: [m00nynads.vercel.app](https://m00nynads.vercel.app)
- **Farcaster**: [@moonynads](https://farcaster.xyz/~/channel/m00nynad)
- **GitHub**: Open source components and documentation
- **Email**: [contact@moonynads.xyz](mailto:contact@moonynads.xyz)

For technical contributions, partnership inquiries, or ecosystem collaboration opportunities, please reach out through our community channels or submit issues/PRs to our public repositories.

*Last Updated: December 2025*

---

## 🤖 Kiro Integration for Kiroween Hackathon

### Strategy for Kiro Implementation
To make Moonynads eligible for the Kiroween hackathon, we need to integrate Kiro technology across multiple aspects of the project. Here's the implementation plan:

#### 1. **Kiro Directory Structure** (`/.kiro`)
- Create required `.kiro` directory at project root
- Add Kiro configuration files for specs, hooks, and steering
- Integrate with Git (remove from .gitignore)

#### 2. **Vibe Coding Integration**
- Use vibe coding for generating new ASCII art pieces based on user prompts
- Implement conversational interfaces for creating custom animations
- Document impressive code generation examples for hackathon submission

#### 3. **Agent Hooks Automation**
- Implement Kiro agent hooks for:
  - Automated ASCII art generation workflows
  - Smart contract deployment automation
  - Testing and validation processes
  - CI/CD pipeline enhancements

#### 4. **Spec-Driven Development**
- Create Kiro specs for:
  - ASCII art generation algorithms
  - Animation parameter optimization
  - Smart contract functionality
  - User interface improvements

#### 5. **Steering Docs Implementation**
- Develop steering documents to guide Kiro in:
  - Artistic style consistency for ASCII pieces
  - Blockchain integration best practices
  - UI/UX design decisions
  - Performance optimization strategies

#### 6. **MCP (Model Context Protocol) Extensions**
- Extend Kiro's capabilities to:
  - Integrate with blockchain APIs
  - Enhance animation engine with AI suggestions
  - Improve storage and metadata generation
  - Connect with external data sources

### Expected Hackathon Category Fit
- **Resurrection Category**: Bringing ASCII art back to life with modern Kiro-enhanced technologies
- **Frankenstein Category**: Stitching together blockchain, AI, animations, and community mechanics
- **Costume Contest Category**: Enhanced UI/UX with Kiro-assisted design improvements

### Implementation Timeline
- **Week 1**: Set up Kiro infrastructure and directory structure
- **Week 2**: Implement vibe coding for ASCII art generation
- **Week 3**: Add agent hooks and spec-driven development workflows
- **Week 4**: Complete steering docs and MCP extensions
- **Week 5**: Test, document, and prepare hackathon submission

---

## 📹 Animation & Mint Types Infrastructure

### Current Capabilities ✅
- **7 Animation Modes**: still, lineWave, blockSway, colorCycle, glitch, frameCycle, svgWave
- **4 Color Palettes**: yellow, green, blue, rainbow
- **Advanced Effects**: Speed (0-3), Amplitude (0-24), Gradient, Character targeting
- **Recording System**: WebM video capture + PNG snapshots
- **Upload Pipeline**: IPFS integration with metadata persistence
- **Animation Studio**: Full lab environment with 13 ASCII designs

### Planned Integration by Day
- **Days 13-16**: Community-first animations (user control + procedural generation)
- **Days 17-20**: Curated + conditional animations (voting, challenges, bonuses)
- **Days 21-24**: Premium + exclusive animations (whale customization, mystery reveals)

**→ See**: `docs/ANIMATION_ROADMAP.md` (comprehensive guide)
**→ See**: `docs/ANIMATION_MINT_MATRIX.md` (visual matrix + deployment plan)

---

## 🎯 Current Status Summary

**Phase 1: Foundation** - ✅ **COMPLETE**
All core UI/UX and basic infrastructure in place.

**Phase 2: Blockchain Infrastructure** - ✅ **90% COMPLETE**
**Recent Enhancements (Week of Dec 3)**:
- ✅ $m00nad token payment system (replaces MON)
- ✅ Three-tier allowlist (none/discount/free)
- ✅ Batch allowlist management function
- ✅ Allowlist Manager UI component
- ✅ Updated ABI and configuration
- 📋 Pending: Testnet deployment & testing

**Phase 3: Community-First Advent Calendar** - 🚧 **READY FOR LAUNCH**
- Day 13 (Free Community Mint) ✅ Ready
- Days 14-19 (Community → Testing) 🔧 Architecture finalized
- Days 20-24 (Premium → Scarcity) 📋 Mechanics documented
- Tiered pricing strategy ✅ Approved
- Social challenge framework ✅ Defined

**Phase 4: Kiro Integration** - 🚧 **PLANNED FOR HACKATHON**
- Kiro directory structure implementation ✅ Planned
- Vibe coding for ASCII generation 🔧 In development
- Agent hooks automation 📋 Roadmap defined
- Spec-driven development 📋 Documentation ready
- Steering docs and MCP extensions 📋 Strategy defined

**Next Priority**:
1. Deploy contract to Monad testnet
2. Test allowlist CSV import workflow
3. Build Day 13-16 public mint UI
4. Begin Kiro integration for hackathon submission
5. Community pre-launch marketing