# Color-Aware ASCII Art Rendering

## Overview

A sophisticated system for enhancing ASCII art with intelligent color and shadow effects. Instead of just applying colors cosmetically, the system alters the actual ASCII characters based on tone, brightness, density, and shadow depth to create genuine visual enhancement while preserving the underlying structure.

## Problem Solved

The original implementation had basic emoji substitution but:
- ❌ Color effects didn't alter ASCII structure
- ❌ No integration between color mode and character selection
- ❌ Missing depth/shadow mapping
- ❌ No gradient ASCII rendering based on tone

## Solution

### Core Concepts

**Character Brightness Mapping**
Each ASCII character has an inherent "brightness" value (0-100):

```
Lightest (0-10):    .  ,  `  '  ^  _
Light (10-30):      -  ~  :  ;  !
Medium (40-60):     |  /  \  c  o  O
Dark (70-100):      x  X  @  #  %  &
```

**Rendering Modes**

1. **Brightness Mode**
   - Varies character density based on how packed each line is
   - Dense lines get darker characters, sparse lines get lighter ones
   - Best for: General enhancement

2. **Shadow Mode**
   - Creates depth by darkening edges (characters next to spaces)
   - Maintains bright characters in dense areas
   - Best for: Circular designs, moons, spheres

3. **Tone-Map Mode**
   - Maps line density directly to brightness ramp
   - Creates smooth transitions from light to dark
   - Best for: Landscapes, varied density artwork

4. **Contour Mode**
   - Highlights density changes (edges and boundaries)
   - Increases brightness where density changes sharply
   - Best for: Complex shapes, revealing outlines

## Implementation

### File Structure

```
/lib/
  ├── color-aware-ascii-generator.ts    # Core algorithm
  └── ascii-generator.ts                # Updated with color integration

/hooks/
  ├── ascii/use-color-aware-ascii.ts    # React hook interface

/components/
  ├── ascii/ascii-color-renderer.tsx    # Interactive demo component

/app/
  ├── ascii-color-demo/page.tsx         # Demo page at /ascii-color-demo
```

### Core Algorithm

```typescript
// Basic flow
for each line:
  for each character:
    originalBrightness = getCharBrightness(char)
    targetBrightness = applyColorMode(
      line, 
      lineIndex, 
      charIndex, 
      originalBrightness
    )
    newChar = findClosestCharInRamp(targetBrightness)
```

### Integration with ASCII Generator

Color-aware rendering is seamlessly integrated into `AsciiGenerator`:

```typescript
const generator = new AsciiGenerator({
  seed: 'my-seed',
  baseDesign: 'moon',
  variation: 'moderate',
  complexity: 5,
  
  // NEW: Color parameters
  colorMode: 'shadow',        // 'brightness' | 'shadow' | 'tone-map' | 'contour' | 'none'
  colorIntensity: 50,         // 0-100
  shadowDepth: 70             // 0-100
})

const result = await generator.generate()
// result.art now contains color-aware ASCII
// result.metadata.colorMode and colorIntensity are included
```

## Usage Examples

### React Hook

```typescript
import { useColorAwareAscii } from '@/hooks/ascii/use-color-aware-ascii'

function MyComponent() {
  const colorAware = useColorAwareAscii({
    baseArt: myAsciiArt,
    mode: 'shadow',
    intensity: 60,
    shadowDepth: 75,
    seed: 'deterministic-seed'
  })

  return (
    <div>
      <pre>{colorAware.coloredArt}</pre>
      <input
        type="range"
        value={colorAware.intensity}
        onChange={(e) => colorAware.setIntensity(parseInt(e.target.value))}
      />
    </div>
  )
}
```

### Direct Function

```typescript
import { integrateColorAwareAscii } from '@/lib/color-aware-ascii-generator'

const enhanced = integrateColorAwareAscii(
  baseArt,
  'contour',  // mode
  60,         // intensity
  70,         // shadowDepth
  'seed'
)
```

## Visual Examples

### Shadow Mode on Moon
Original:
```
  .---.
 /     \
|   o   |
 \     /
  '---'
```

With Shadow (100% intensity, 80% depth):
```
  .---.
 |     |
@   #   @
 |     |
  '---'
```

Characters on edges become darker (#, @) while the center maintains structure.

### Tone-Map on Varied Density
Maps density gradient to brightness ramp smoothly, revealing subtle tonal variations.

### Contour on Complex Shape
Highlights where density changes sharply, creating edge detection that reveals the shape's outline.

## Parameters

### colorMode
- `'none'` - No color effects (original behavior)
- `'brightness'` - Line density to brightness
- `'shadow'` - Edge darkening for depth
- `'tone-map'` - Density mapping to ramp
- `'contour'` - Edge detection and highlighting

### colorIntensity (0-100)
How strongly the color mode affects character selection
- 0: No effect (all characters keep original brightness)
- 50: Moderate effect (some characters change)
- 100: Maximum effect (strong transformations)

### shadowDepth (0-100, only for shadow mode)
How dark the shadow effect becomes
- 0: Very subtle shadowing
- 50: Moderate shadows
- 100: Maximum shadow darkening

## Design Decisions

1. **Character Ramps**: Hardcoded brightness values preserve determinism
2. **Theme Detection**: Automatically selects ramp based on detected content (lunar, standard, dramatic)
3. **Seed Reproducibility**: Color variations are deterministic when seed is provided
4. **Structure Preservation**: Never removes characters, only replaces with alternatives
5. **Theme Integrity**: Respects forbidden and allowed characters from pant templates

## Benefits

✅ Maintains ASCII art integrity while enhancing visual depth
✅ Deterministic - same seed always produces same output
✅ Integrates seamlessly with existing generator
✅ Multiple modes for different artistic goals
✅ Tunable intensity for fine-grained control
✅ Works with any ASCII art, not just moons

## Performance

- Linear time complexity O(n) where n = total characters
- No external dependencies
- Runs client-side for instant feedback
- Lightweight hook interface

## Testing

Visit `/ascii-color-demo` to:
- See interactive examples
- Test all rendering modes
- Adjust intensity and shadow depth
- Download rendered results
- Compare before/after side-by-side

## Future Enhancements

- [ ] Color palette mapping (e.g., red/green/blue instead of monochrome)
- [ ] Animated color transitions
- [ ] Machine learning for optimal mode selection
- [ ] GPU acceleration for real-time massive ASCII
- [ ] Import custom character ramps
- [ ] Edge blur/soft shadow effects
