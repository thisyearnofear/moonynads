# Color Rendering for ASCII Pants

## Overview

The animation lab pages now support four color rendering modes that add monochrome and negative space interpretation to your ASCII art pieces without modifying the underlying design.

## Modes

### 1. No Color (default)
- Standard ASCII rendering with optional palette effects
- Original black & white text with animation modes
- Baseline for comparing with other modes

### 2. Monochrome Patch Coloring
- Analyzes density (non-space character ratio) per line
- Splits the artwork into regions:
  - **High density** (>40% non-space) → black background + white text
  - **Low density** (<40% non-space) → white background + black text
- Creates distinct patches following the contours of the design
- Merges small regions (<3 lines) to reduce fragmentation

**Visual Effect:** The design appears as silhouettes with contrasting backgrounds, emphasizing the shape's outline.

### 3. Negative Space
- Colors the **void around the shape** instead of the shape itself
- Inverts the monochrome logic: highlights empty space
- Creates a striking outline/glow effect
- Particularly effective for organic shapes (lady, hips, heart)

**Visual Effect:** The design emerges from colored negative space, like a cutout or shadow.

### 4. Density Map
- Grayscale mapping based on character density per line
- Each line gets a shade: 0% density = white, 100% density = black
- Smooth gradient from sparse to dense areas
- No background coloring, just character color

**Visual Effect:** Gradient rendering showing density distribution across the artwork.

## Implementation Details

### Hook: `useColorRendering`
Located in `hooks/ascii/use-color-rendering.ts`

```typescript
const colorRendering = useColorRendering(text, mode);

// Returns:
- lines: ASCII lines array
- lineDensities: density % per line
- regions: ColorRegion[] with contour data
- getCharColor(lineIndex, charIndex, char): string | null
- getLineBackgroundColor(lineIndex): string | null
- metadata: ColorMetadata
```

### Integration Points
1. **HTML Rendering** (`renderLineHTML`)
   - Applies character colors via style prop
   - Applies line background colors
   
2. **Canvas Rendering** (recording/export)
   - Draws background rectangles for monochrome/negative-space
   - Applies character colors per-character
   
3. **UI Controls**
   - Dropdown in animator toolbar: "color mode selector"
   - Works alongside existing palette effects
   - Independent from animation modes

## Technical Notes

### Density Threshold
- Currently set to 40% non-space characters
- Adjustable in `use-color-rendering.ts`: `const isHigh = density > 40`

### Region Merging
- Regions smaller than 3 lines get merged with adjacent same-color regions
- Prevents fragmentation in sparse ASCII art

### Space Character Handling
- Spaces are never colored directly
- Only non-space characters receive color
- Preserves ASCII structure and monospace alignment

### Performance
- O(n) where n = number of lines
- Density calculation on every render (fast)
- Color computation per-character only when needed

## Examples

### Moon Piece with Monochrome
The moon's body becomes black patches, surrounding void becomes white—creates sharp contrast between form and background.

### Lady with Negative Space
The figure's curves dissolve into white/black void space—emphasizes silhouette and flowing lines.

### Heart with Density Map
Creates a gradient from sparse edges to dense center—shows the heart's internal structure.

## Future Enhancements

- [ ] Per-design color presets (e.g., "lady uses negative-space by default")
- [ ] Animated color cycling between modes
- [ ] Custom density thresholds per mode
- [ ] Color patch export as SVG regions
- [ ] Integration with generative variations (seed-based color schemes)
