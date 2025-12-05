# 🎃 Judge Access Guide - Moonynads

## 🔐 Secret Judge Access (Confidential)

### Method 1: Password URL (RECOMMENDED)
Use one of these secret URLs:

```
https://m00nynads.vercel.app?judge=kiroween-moonynads-2025
https://m00nynads.vercel.app?demo=frankenstein-demo
https://m00nynads.vercel.app?judge=spooky-moon-judge
```

**Note**: These passwords are confidential. Do not share publicly.

### Method 2: Keyboard Shortcut
1. Visit: https://m00nynads.vercel.app
2. Press: **Ctrl+Shift+J** (Windows/Linux) or **Cmd+Shift+J** (Mac)
3. Page will reload with full access enabled

### Method 3: Browser Console
1. Visit: https://m00nynads.vercel.app
2. Open browser console (F12 or right-click → Inspect)
3. Run: `sessionStorage.setItem('judge-mode', 'true')`
4. Refresh the page

### How to Verify Judge Mode is Active
- Look for a small 🎃 emoji in the footer (bottom right)
- Hover over it to see "Judge Mode Active"
- No intrusive banners - maintains user experience
- All content accessible without wallet

---

## 🎯 What to Test

### 1. Main Gallery
**URL**: https://m00nynads.vercel.app?demo=true

**Features**:
- Browse all 12 ASCII art designs
- View rarity system (Common → Legendary)
- Click any design for full-size view
- Click "🎬 Animate" button to open animation lab

**Designs**:
- Moon #1 (Common)
- Moon #2 (Uncommon)
- Moon #3 (Common)
- Lunar Heart (Rare)
- Moon Lady (Epic)
- Chudnovsky Moon (Legendary)
- Lunar Butt (Uncommon)
- Moon Hips (Rare)
- Lunar L (Common)
- Lunar M (Common)
- Multi-Moon (Uncommon)
- Lunar S (Rare)
- XL Moon (Epic)

### 2. Animation Labs
**URL Pattern**: https://m00nynads.vercel.app/pants/{design-id}

**Direct Links**:
- https://m00nynads.vercel.app/pants/moon
- https://m00nynads.vercel.app/pants/moon2
- https://m00nynads.vercel.app/pants/heart
- https://m00nynads.vercel.app/pants/lady
- https://m00nynads.vercel.app/pants/chudnovsky
- https://m00nynads.vercel.app/pants/headupbutt
- https://m00nynads.vercel.app/pants/hips
- https://m00nynads.vercel.app/pants/l
- https://m00nynads.vercel.app/pants/m
- https://m00nynads.vercel.app/pants/multi
- https://m00nynads.vercel.app/pants/s
- https://m00nynads.vercel.app/pants/xl

**Animation Features to Test**:
1. **Animation Modes** (7 types):
   - lineWave - Vertical wave effect
   - blockSway - Horizontal sway
   - colorCycle - Color transitions
   - glitch - Random displacement
   - pulse - Scale pulsing
   - rotate - Character rotation
   - typewriter - Sequential reveal

2. **Color Palettes** (4 options):
   - Yellow (default lunar theme)
   - Green (matrix style)
   - Blue (cool tones)
   - Rainbow (gradient cycling)

3. **Controls**:
   - Speed slider (0.1x to 3x)
   - Amplitude slider (0 to 100)
   - Target character input
   - Play/Pause toggle

4. **Recording & Export**:
   - Record WebM video (30 or 60 FPS)
   - Export PNG snapshot
   - Settings persist in localStorage

5. **Upload** (if storage configured):
   - Upload to Grove storage
   - Fallback to local storage
   - Metadata captured with animation settings

### 3. Blockchain Integration (Optional)
**URL**: https://m00nynads.vercel.app

**Features**:
- Connect wallet (MetaMask, WalletConnect, Coinbase, Farcaster)
- Auto-switch to Monad network (Chain ID: 143)
- View $m00nad token balance
- See token-gated tier system
- Test allowlist functionality

**Note**: Demo mode bypasses this, but you can test wallet connection separately.

### 4. Farcaster Mini App
**URL**: Open in Warpcast app

**Features**:
- Works as Farcaster Mini App
- Responsive modal design (424×695px)
- Share to Farcaster functionality
- Farcaster wallet connector

---

## 🔍 Testing Checklist

### Gallery Experience
- [ ] All 12 designs visible without wallet
- [ ] Rarity badges display correctly
- [ ] Click to view full-size works
- [ ] "Animate" buttons visible on each card
- [ ] Responsive on mobile/desktop

### Animation Labs
- [ ] All 7 animation modes work
- [ ] All 4 color palettes work
- [ ] Speed control affects animation
- [ ] Amplitude control affects animation
- [ ] Play/Pause toggle works
- [ ] Settings persist after page reload
- [ ] WebM recording works
- [ ] PNG snapshot works
- [ ] 60fps performance maintained

### Blockchain (Optional)
- [ ] Wallet connects successfully
- [ ] Network switches to Monad
- [ ] Token balance displays
- [ ] Tier system shows correctly

### Farcaster (Optional)
- [ ] Opens in Warpcast
- [ ] Responsive design works
- [ ] Share functionality works

---

## 🎨 Key Features to Highlight

### 1. Frankenstein Architecture
- ASCII art (1970s) + Next.js 15 (2025)
- Static text files + Real-time canvas animations
- Centralized hosting + Decentralized blockchain
- Social protocol + Financial protocol

### 2. Animation System
- 7 unique animation modes
- Real-time canvas rendering at 60fps
- WebM video recording
- localStorage persistence
- Multi-provider storage

### 3. Blockchain Integration
- Custom Monad L2 chain configuration
- Three-tier allowlist system
- CSV batch import
- Token-gated access

### 4. Kiro Development
- Built in 16 hours over 4 days
- ~5,000 lines of code generated
- Vibe coding + spec-driven development
- 22 major iterations

---

## 🐛 Troubleshooting

### Demo Mode Not Working?
1. Clear browser cache
2. Try incognito/private window
3. Use URL parameter method: `?demo=true`

### Animation Not Smooth?
1. Close other browser tabs
2. Try different animation mode
3. Reduce speed/amplitude
4. Check browser console for errors

### Recording Not Working?
1. Grant browser permissions for media
2. Try PNG snapshot instead
3. Check browser supports MediaRecorder API

### Wallet Connection Issues?
1. Demo mode bypasses wallet requirement
2. Ensure MetaMask/wallet installed
3. Check network is Monad (Chain ID: 143)

---

## 📊 Performance Expectations

- **Page Load**: < 2 seconds
- **Animation FPS**: 60fps on modern devices
- **Recording Quality**: High (configurable bitrate)
- **Storage Upload**: < 5 seconds for typical file

---

## 💡 Tips for Judges

1. **Start with Demo Mode**: Use `?demo=true` for easiest access
2. **Try Multiple Designs**: Each has unique ASCII art
3. **Test All Animation Modes**: Each mode has different effects
4. **Record a Video**: Shows off the recording feature
5. **Check .kiro Directory**: See comprehensive development docs
6. **Review Git History**: 42 commits showing iterative development

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Try demo mode: `?demo=true`
3. Review `.kiro/README.md` for project overview
4. Check `.kiro/KIROWEEN_SUBMISSION.md` for full details

---

## 🎬 Suggested Testing Flow (5 minutes)

1. **Visit with demo mode** (30s)
   - https://m00nynads.vercel.app?demo=true

2. **Browse gallery** (1min)
   - Scroll through all 12 designs
   - Click one for full view
   - Note rarity system

3. **Test animation lab** (2min)
   - Click "Animate" on any design
   - Try 2-3 animation modes
   - Adjust speed and color
   - Record a short video

4. **Check documentation** (1min)
   - Browse `.kiro/` directory
   - Read `KIROWEEN_SUBMISSION.md`
   - Review technical specs

5. **Optional: Wallet test** (30s)
   - Connect wallet
   - See Monad network switch
   - View token-gated features

---

**Total Time**: ~5 minutes for comprehensive evaluation

**Demo Mode Active**: Look for yellow banner at top saying "🎃 DEMO MODE ACTIVE"

---

*Built with Kiro AI - A true Frankenstein's monster of web technologies 🧟*
