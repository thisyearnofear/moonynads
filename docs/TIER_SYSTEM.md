# Lunar Tier System

## Overview

The progressive token-gated access system has been redesigned with a lunar theme that aligns with Moonynads' ASCII art aesthetic.

## Tier Progression

### 🌑 LUNAR VISITOR (0 days)
- **Status**: No early access
- **Description**: Awaiting lunar alignment
- **UI Theme**: Gray/Dark - locked state

### 🌒 CRESCENT HOLDER (1-3 days)
- **Token Requirements**: 250M - 450M m00nynad
- **Days Unlocked**: 1-3 of 12
- **Description**: Crescent phase holder
- **UI Theme**: Amber/Yellow accent

### 🌓 HALF MOON SEEKER (4-6 days)
- **Token Requirements**: 350M - 550M m00nynad
- **Days Unlocked**: 4-6 of 12
- **Description**: Half moon phase holder
- **UI Theme**: Blue accent

### 🌔 WAXING COLLECTOR (7-9 days)
- **Token Requirements**: 450M - 650M m00nynad
- **Days Unlocked**: 7-9 of 12
- **Description**: Waxing moon collector
- **UI Theme**: Yellow/Gold accent

### 🌕 LUNATIC ELITE (10-11 days)
- **Token Requirements**: 550M - 750M m00nynad
- **Days Unlocked**: 10-11 of 12
- **Description**: Elite lunar collector
- **UI Theme**: Purple accent

### ⭐ CELESTIAL WHALE (12 days)
- **Token Requirements**: 850M+ m00nynad
- **Days Unlocked**: All 12 days unlocked
- **Description**: Complete lunar mastery
- **UI Theme**: Cyan accent

## Implementation Details

### Files Modified

1. **lib/tier-system.ts** (NEW)
   - Tier configuration with lunar themes
   - Moon phase emojis (🌑 🌒 🌓 🌔 🌕 ⭐)
   - ASCII art badges for each tier
   - Helper functions for tier lookups

2. **hooks/use-advent-access.ts**
   - Updated tier descriptions with lunar language
   - Changed from generic "early access" to thematic descriptions

3. **components/token-gate.tsx**
   - Completely redesigned tier badge display
   - ASCII art integration
   - Lunar-themed copy throughout
   - Stats dashboard showing balance and days unlocked
   - Progress tracking for next tier

### Visual Design

- **ASCII Art Badges**: Each tier has a boxed ASCII representation
- **Moon Phase Progression**: Visual emoji progression from 🌑 → 🌕 → ⭐
- **Monospace Font**: Maintains JetBrains Mono throughout for terminal aesthetic
- **Color Palette**:
  - Crescent: Amber
  - Half Moon: Blue
  - Waxing: Yellow/Gold
  - Full Moon: Purple
  - Celestial: Cyan

### Messaging

Replaced generic marketing language with lunar-themed copy:
- "No early access" → "Awaiting lunar alignment"
- "Early access to X days" → "X days unlocked"
- "Insufficient balance" → "Lunar alignment required"
- "All early access unlocked" → "All lunar secrets revealed"

## Future Enhancements

- Animated moon phase transitions as users accumulate tokens
- Tier-specific NFT metadata display
- Leaderboard by tier level
- Dynamic ASCII art that changes based on holdings
