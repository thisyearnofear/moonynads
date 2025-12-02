# Site-Wide Theme Consistency Audit

## Status: **PARTIALLY COHESIVE** ✓/✗

The site has strong technical consistency but **messaging and copy are fragmented** between lunar theme and cheeky/generic language.

---

## ✅ WHAT'S WORKING

### Theme-Aligned Components
- **Hero Section**: Strong ASCII art, monospace aesthetics ✓
- **Footer**: Clean, minimal, thematic ✓
- **Tier System**: Completely redesigned with lunar phases ✓
- **Token Gate**: Now uses lunar language and ASCII badges ✓
- **Layout/Metadata**: OG images, button titles updated ✓

### Visual Consistency
- Monospace font (JetBrains Mono) throughout ✓
- Yellow/gold accent color scheme consistent ✓
- Dark mode support maintained ✓
- ASCII art integration across key components ✓

---

## ❌ THEME BREAKS & INCONSISTENCIES

### 🔴 CRITICAL: Copy/Messaging Misalignment

#### **1. Cheeky Copy Library** (`lib/cheeky-copy.ts`) - MAJOR BREAK
**Problem**: Contains crude "butt/cheek" wordplay that directly contradicts lunar theme
- Loading: "Getting our ducks in a row..." (generic)
- CTAs: "Get Behind This Project", "Join the Rear Guard" (crude/off-brand)
- Features: "appreciates the finer... angles" (crude reference)
- Success: "Boom! That's how you secure the bag(s)! 🍑" (crude, emoji breaks aesthetic)
- Descriptions: Heavy butt/rear/bottom humor throughout

**Status**: Not used prominently but exists in codebase. If used, breaks theme entirely.

---

#### **2. Preview Banner** (`components/preview-banner.tsx`) - MODERATE BREAK
**Issues**:
- Title: "Preview Access" (generic, not lunar)
- Copy: "Sneak a peek at what's coming" (generic action phrase)
- Bonus: "don't get caught behind!" (crude reference from cheeky-copy)

**Should be**:
```
Title: "Lunar Preview" or "Phase Preview"
Copy: "Gaze upon the lunar phases awaiting alignment • Advent begins Dec 13th"
```

---

#### **3. Wallet Connect** (`components/wallet-connect.tsx`) - MINOR BREAK
**Issues**:
- Button: "Connect Wallet" (generic blockchain term)
- Loading: "Connecting..." (generic)
- Network: "Switch to Monad" (functional but not thematic)
- Disconnect: "Disconnect" (generic)

**Should be**:
```
Connect Wallet → "Align Your Vault" or "Begin Lunar Journey"
Connecting... → "Aligning celestial coordinates..."
Switch to Monad → "Navigate to Monad Orbit"
Disconnect → "Depart"
```

---

#### **4. Share Button** (`components/farcaster-share.tsx`) - MINOR BREAK
**Issues**:
- Button text: "Share" (completely generic)
- Default copy: "Check out Moonynads" (generic greeting)

**Should be**:
```
Button: "💜 Broadcast Lunar" or "💜 Share the Moon"
Default: "Discovered a lunar masterpiece on Monad..."
```

---

#### **5. Token Banner** (`components/memetoken-banner.tsx`) - MINOR BREAK
**Issues**:
- Link text: "View Token Contract ↗" (generic blockchain UX)
- Icon: 🪙 (generic coin, breaks moon theme)

**Should be**:
```
Link: "Explore Lunar Holdings" or "Examine the m00nynad Archive"
Icon: 🌙 or ⭐
```

---

#### **6. Moonverse Navigation** (`components/moonverse-nav.tsx`) - MINOR BREAK
**Issues**:
- Button: "🌌 Explore Moonverse" (uses "explore" - too generic given tier system uses it)
- No lunar metaphor for navigation

**Should be**:
```
"🌌 Traverse the Moonverse" or "🌌 Enter the Moonverse"
```

---

#### **7. Moonverse Section** (`components/moonverse.tsx`) - MIXED
**Good**: 
- Header "🌌 MOONVERSE" ✓
- Cheeky wordplay: "discover what happens when great minds come together! 🍑" (uses emoji from cheeky-copy, inconsistent with ASCII aesthetic)

**Bad**:
- Intro mentions "🍑" emoji (breaks minimalist aesthetic)
- Generic descriptions for apps

---

### 🟡 MODERATE: Loading States & Error Messages

**File**: `lib/cheeky-copy.ts`

**Loading messages** (not currently used but in codebase):
- "Getting our ducks in a row..." ✗
- "Positioning for optimal viewing..." ✗
- "Checking the rear view..." ✗
- "Mooning around with the data..." ✓ (actually good)
- "Behind the scenes magic happening..." ✗

**Error messages**:
- "Can't seem to connect the dots... or the wallet" (mediocre)
- "Looks like your bag needs more cushioning" (crude)
- "Well, that's a pain in the assets!" (crude)

**Success messages**:
- Most contain crude humor or 🍑 emoji

---

### 🟡 MINOR: Button & Action Language

**Generic blockchain terms throughout**:
- "Connect Wallet" (not lunar)
- "Disconnect" (not lunar)
- "Switch Network" (not lunar)
- "Get Tokens" (not lunar)
- "🔄 Refresh Balance" (generic action)

---

## 📊 CONSISTENCY SCORECARD

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
| Cheeky Copy Lib | ✗ | ✗ | N/A | 2/10 |

**Overall Site Coherence: 7/10**

---

## 🎯 PRIORITY FIX LIST

### Tier 1 (Must Fix - Breaks Theme)
1. **Remove/refactor `lib/cheeky-copy.ts`** - Replace crude wordplay with lunar metaphors
2. **Update wallet-connect.tsx** - Lunar-themed button text
3. **Update preview-banner.tsx** - Replace generic preview language

### Tier 2 (Should Fix - Rough Edges)
4. **Update farcaster-share.tsx** - Lunar-themed sharing copy
5. **Update token-banner.tsx** - Replace coin emoji, lunar-themed link text
6. **Update moonverse-nav.tsx** - Consistent action verb

### Tier 3 (Nice to Have - Polish)
7. **Loading states** - Create lunar-themed loading messages
8. **Error messages** - Create lunar-themed error handling
9. **Success messages** - Create lunar-themed success states

---

## 🌙 LUNAR VOCABULARY GUIDE

**For replacements, use these instead of generic language:**

| Generic | Lunar Alternative |
|---------|------------------|
| Connect | Align, Synchronize, Attune |
| Wallet | Vault, Holdings, Treasury |
| Balance | Holdings, Cosmic Account |
| Tokens | Lunar Assets, Moon Holdings, Celestial Currency |
| Access | Ascend, Unlock Phase, Reveal |
| Share | Broadcast, Transmit, Radiate |
| Explore | Traverse, Navigate, Venture |
| View | Gaze Upon, Observe, Perceive |
| Preview | Lunar Glimpse, Phase Preview |
| Loading | Aligning coordinates, Channeling lunar energy |
| Error | Lunar misalignment, Cosmic discord |
| Success | Lunar ascension, Phase unlocked |

---

## 📝 NEXT STEPS

1. Update button text and CTAs with lunar vocabulary
2. Remove/replace crude wordplay from cheeky-copy.ts
3. Create lunar-themed loading and error states
4. Audit remaining components for generic language
5. Test for consistency across all user paths
