# Animation Infrastructure: Build Checklist

## What's Already Built ✅ (DO NOT REBUILD)

### Animation Engine
- [x] `components/ascii-animator.tsx` - 7 animation modes
- [x] `hooks/useAnimationState.ts` - State persistence
- [x] `hooks/useAnimationRecorder.ts` - WebM recording
- [x] `hooks/useAnimationUpload.ts` - Upload pipeline

### Storage & Config
- [x] `lib/storage/provider.ts` - Storage interface
- [x] `lib/pants.ts` - Design registry (13 ASCII designs)

### UI Components
- [x] `/app/pants/page.tsx` - Animation studio index
- [x] `/app/pants/[id]/page.tsx` - Individual design lab

### Animation Data
- [x] `public/pants/*.txt` - 13 ASCII designs
- [x] `public/pants/hips-frame-[1-4].txt` - Frame sequences

**Total Existing**: ~900 lines of production code + 13 ASCII art files

---

## What Needs to Be Built 🚧

### Tier 1: Critical for Day 13 Launch

#### 1. ASCII Generation Engine
```
lib/generate/ascii-generator.ts (NEW)
├─ Deterministic seed generator
├─ Density parameter (sparse → dense)
├─ Complexity parameter (simple → intricate)
├─ Output: Consistent ASCII per seed
└─ Test: 1000+ seeds for uniqueness

Lines of code: ~200-300
Time: 2-3 days
```

#### 2. Animation Preview Component
```
components/animation/preview.tsx (NEW)
├─ Read-only animation display
├─ Configurable size/speed
├─ Loop/pause controls
├─ No recording functionality
└─ Reusable across all days

Lines of code: ~150
Time: 1 day
```

#### 3. Animation Configurator Component
```
components/animation/configurator.tsx (NEW)
├─ Mode selector (7 options)
├─ Palette selector (4 options)
├─ Speed slider (0-3)
├─ Amplitude slider (0-24)
├─ Gradient toggle
├─ Target char input
├─ Real-time preview
├─ Save/load presets
└─ Reset to defaults

Lines of code: ~250
Time: 2 days
```

#### 4. Day 13 Mint Component
```
components/mint/day-13-free.tsx (NEW)
├─ ASCII design selector (13 options)
├─ ASCIIAnimator integration
├─ AnimationConfigurator integration
├─ RecordingUI integration
├─ Wallet connection
├─ Free mint transaction
└─ Success modal

Lines of code: ~300
Time: 3 days
```

#### 5. Enhanced Recording UI
```
components/animation/recording-ui.tsx (NEW)
├─ Start/stop controls
├─ FPS selector (1-12)
├─ Duration display
├─ Playback preview
├─ Download button
├─ Upload button
├─ Status messages
└─ Error handling

Lines of code: ~200
Time: 2 days
```

**Subtotal Tier 1: ~1100 lines, 10 days**

---

### Tier 2: Core Days 13-16

#### 6. Deterministic ASCII Validator
```
lib/generate/ascii-validator.ts (NEW)
├─ Check for collisions
├─ Validate output quality
├─ Test 10,000 generations
└─ Performance benchmarks

Lines of code: ~100
Time: 1 day
```

#### 7. Day 16 Generative Mint Component
```
components/mint/day-16-generative.tsx (NEW)
├─ Seed input / randomize button
├─ Generate preview button
├─ ASCIIAnimator with preview
├─ AnimationConfigurator
├─ m00nad payment integration
├─ Allowlist tier checking
└─ Mint transaction

Lines of code: ~350
Time: 3 days
```

#### 8. Metadata Builder
```
lib/animation/metadata-builder.ts (NEW)
├─ Animation settings → JSON
├─ NFT metadata generation
├─ IPFS URL construction
├─ Rarity calculation
└─ Validation

Lines of code: ~150
Time: 1 day
```

#### 9. Generic Mint Page Template
```
app/mint/page.tsx (NEW)
├─ Phase selector
├─ Router to day-specific components
├─ Status display
└─ Progress tracker

Lines of code: ~100
Time: 1 day
```

**Subtotal Tier 2: ~700 lines, 6 days**

---

### Tier 3: Showcase System

#### 10. Animation Gallery Component
```
components/showcase/animation-gallery.tsx (NEW)
├─ Grid layout
├─ Lazy loading
├─ Sorting options
├─ Filtering (mode, palette, rarity)
├─ Live previews
└─ Farcaster share buttons

Lines of code: ~300
Time: 2 days
```

#### 11. Showcase Day Page
```
app/showcase/day/[day]/page.tsx (NEW)
├─ Query NFTs for day
├─ Display all animations
├─ Animation metadata display
├─ Collector stats
└─ Social sharing

Lines of code: ~200
Time: 2 days
```

#### 12. Showcase Animations Library
```
app/showcase/animations/page.tsx (NEW)
├─ Demonstrate all 7 modes
├─ Demonstrate all 4 palettes
├─ Interactive controls
├─ Save preset button
└─ Copy settings to clipboard

Lines of code: ~250
Time: 2 days
```

#### 13. Collector Portfolio Page
```
app/showcase/collector/[address]/page.tsx (NEW)
├─ Fetch user's NFTs
├─ Display all animations
├─ Rarity breakdown
├─ Timeline view
├─ Export functionality
└─ Share portfolio link

Lines of code: ~200
Time: 2 days
```

**Subtotal Tier 3: ~950 lines, 8 days**

---

### Tier 4: Advanced Features (Post-Launch)

#### 14. Days 17-20 Components
```
components/mint/day-17-voting.tsx (NEW)
components/mint/day-18-hybrid.tsx (NEW)
components/mint/day-19-challenge.tsx (NEW)
components/mint/day-20-tribute.tsx (NEW)

Total: ~400 lines
Time: 3 days
```

#### 15. Days 21-24 Components
```
components/mint/day-21-whale.tsx (NEW)
components/mint/day-22-mystery.tsx (NEW)
components/mint/day-23-auction.tsx (NEW)
components/mint/day-24-finale.tsx (NEW)

Total: ~500 lines
Time: 4 days
```

#### 16. Analytics & Monitoring
```
lib/animation/analytics.ts (NEW)
├─ Track animation usage
├─ Record mode popularity
├─ Monitor rendering performance
├─ Log errors/warnings
└─ Generate reports

Lines of code: ~200
Time: 2 days
```

---

## Recommended Build Order

### Phase A: Foundation (Ready by Day 6)
1. ASCII Generator + Validator (Days 1-2)
2. Animation Preview + Configurator (Days 2-3)
3. Enhanced Recording UI (Days 4-5)
4. Metadata Builder (Day 6)

### Phase B: Days 13-16 (Ready by Day 13)
5. Day 13 Mint Component (Days 7-9)
6. Day 16 Generative Mint (Days 10-12)
7. Mint page template (Day 13)

### Phase C: Showcase (Ready by Day 16)
8. Animation Gallery (Days 14-15)
9. Showcase pages (Days 16-19)

### Phase D: Advanced Days (Ready by Day 20)
10. Days 17-20 components (Days 20-22)
11. Days 21-24 components (Days 23-26)

### Phase E: Polish (Ongoing)
12. Analytics & monitoring
13. Performance optimization
14. Accessibility audit
15. Mobile optimization

---

## File Structure for New Components

```
components/
├── animation/
│   ├── preview.tsx              # NEW - Read-only display
│   ├── configurator.tsx         # NEW - Parameter controls
│   ├── recording-ui.tsx         # NEW - Recording controls
│   └── gallery.tsx              # NEW - Grid display
├── mint/
│   ├── day-13-free.tsx          # NEW
│   ├── day-16-generative.tsx    # NEW
│   ├── day-17-voting.tsx        # NEW (later)
│   ├── day-18-hybrid.tsx        # NEW (later)
│   ├── day-19-challenge.tsx     # NEW (later)
│   ├── day-20-tribute.tsx       # NEW (later)
│   ├── day-21-whale.tsx         # NEW (later)
│   ├── day-22-mystery.tsx       # NEW (later)
│   ├── day-23-auction.tsx       # NEW (later)
│   └── day-24-finale.tsx        # NEW (later)
└── showcase/
    └── animation-gallery.tsx    # NEW

lib/
├── generate/
│   ├── ascii-generator.ts       # NEW
│   └── ascii-validator.ts       # NEW
├── animation/
│   ├── metadata-builder.ts      # NEW
│   └── analytics.ts             # NEW (later)
└── (existing files remain)

app/
├── mint/
│   └── page.tsx                 # NEW
├── showcase/
│   ├── animations/
│   │   └── page.tsx             # NEW
│   ├── day/
│   │   └── [day]/
│   │       └── page.tsx         # NEW
│   └── collector/
│       └── [address]/
│           └── page.tsx         # NEW
└── (existing files remain)
```

---

## Dependencies & Integration Points

### Must integrate with existing:
- ✅ `components/ascii-animator.tsx` (already works)
- ✅ `hooks/useAnimationState.ts` (already works)
- ✅ `hooks/useAnimationRecorder.ts` (already works)
- ✅ `hooks/useAnimationUpload.ts` (already works)
- ✅ `lib/storage/provider.ts` (already works)

### Must integrate with new contracts:
- `lib/contracts.ts` (already updated with payment/allowlist ABI)
- `blockchain/Moonynads.sol` (already updated with token payment)

### Must integrate with utilities:
- `lib/blockchain.ts` (token utilities)
- `lib/tier-system.ts` (tier calculations)
- `hooks/use-allowlist.ts` (NEW - allowlist checking)

---

## Testing Checklist

### Unit Tests (Essential)
- [ ] ASCII generator determinism (same seed → same output)
- [ ] ASCII generator uniqueness (1000+ seeds have 0 collisions)
- [ ] Animation metadata serialization
- [ ] Rarity calculation correctness
- [ ] Animation parameter validation

### Integration Tests (Essential)
- [ ] Record → Upload → Metadata retrieval pipeline
- [ ] Mint transaction → NFT metadata verification
- [ ] Allowlist tier checking → correct pricing
- [ ] Payment token transfer validation

### E2E Tests (Essential for Launch)
- [ ] Day 13: Select design → customize → record → upload → mint (free)
- [ ] Day 16: Generate → customize → preview → mint (50M payment)
- [ ] Showcase: Load gallery → filter → playback
- [ ] Collector: View portfolio → share link

### Performance Tests
- [ ] ASCII generator: <100ms per generation
- [ ] Gallery load: <2s for 1000 animations
- [ ] Canvas rendering: 60 FPS stable
- [ ] Recording: <5s for typical WebM

---

## Deployment Checklist

Before launch of each phase:

### Phase A (Day 6)
- [ ] ASCII generator deployed
- [ ] Generators tested for collisions (10,000 runs)
- [ ] RecordingUI fully functional
- [ ] Metadata builder verified

### Phase B (Day 13)
- [ ] Day 13 component live
- [ ] Free mint working (no payment required)
- [ ] Animation metadata correct in NFTs
- [ ] Recording pipeline tested end-to-end

### Phase B+ (Day 16)
- [ ] Day 16 component live
- [ ] Generative preview working
- [ ] m00nad payment functional
- [ ] Allowlist pricing correct

### Phase C (Day 16+)
- [ ] Showcase gallery fully rendered
- [ ] Filters working correctly
- [ ] Sharing buttons functional
- [ ] Performance meets targets

---

## Estimated Workload

| Phase | Lines | Days | Priority |
|-------|-------|------|----------|
| A (Foundation) | 1100 | 10 | CRITICAL |
| B (Days 13-16) | 700 | 6 | CRITICAL |
| C (Showcase) | 950 | 8 | HIGH |
| D (Advanced) | 900 | 7 | MEDIUM |
| E (Polish) | 200 | 5 | LOW |
| **TOTAL** | **3850** | **36** | |

**Real timeline with holidays/reviews: 5-6 weeks**

---

## This Prevents

❌ **Rewriting existing animation code** (don't touch what works)
❌ **Building showcase before core** (core must come first)
❌ **Deploying without testing collisions** (determinism is critical)
❌ **Half-finished components** (complete each tier before moving on)
❌ **Scope creep** (Tiers 1-3 only for launch)

---

## Next Decision Point

**Ready to start building Phase A (Foundation)?**

Recommend order:
1. Start with ASCII Generator (most critical)
2. Validate determinism (1000+ seed test)
3. Build Preview + Configurator components
4. Build Enhanced Recording UI
5. Then move to Day 13 component

**Or would you like to focus on something else first?**
