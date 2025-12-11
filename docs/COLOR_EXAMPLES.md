# Color-Aware ASCII Rendering - Visual Examples

## Mode Comparisons

### Example 1: Simple Circle

**Original:**
```
  -----
 /     \
|       |
|       |
 \     /
  -----
```

**Brightness Mode (intensity 60%):**
```
  -----
 |     |
;       ;
:       :
 |     |
  -----
```
*Note: Dense edges (----) stay consistent; lighter areas get lighter characters*

**Shadow Mode (intensity 60%, shadowDepth 75%):**
```
  -----
 @     @
#       #
#       #
 @     @
  -----
```
*Note: Edges next to spaces darken (/, \ → @, #); center preserved*

**Tone-Map Mode (intensity 60%):**
```
  ,,,,,
 ;     ;
o       o
o       o
 ;     ;
  ,,,,,
```
*Note: Density gets mapped to ramp; smooth gradient from light (,) to medium (o)*

**Contour Mode (intensity 60%):**
```
  .....
 |     |
@       @
@       @
 |     |
  .....
```
*Note: Highlights boundary changes; dark marks (#, @) at density edges*

---

### Example 2: Moon with Craters

**Original:**
```
    .....
   .......
  .o.o.o..
 .o  ooo o.
.o  o   o o
|o o   o  o|
|o  ooo   o|
.o   o o  o.
 .o.o.o...
   .......
    .....
```

**Shadow Mode (intensity 70%, shadowDepth 80%):**
```
    .....
   |||||  
  #o#o#o#@
 @o  ooo o@
@o  o   o o@
@o o   o  o@
@o  ooo   o@
@o   o o  o@
 @o#o#o###
   @@@@@@@
    #####
```
*Creates depth: edges darken, structure preserved, crater details intact*

**Tone-Map Mode (intensity 60%):**
```
    `````
   ,,,,,,
  .o.o.o..
 ;o  ooo o;
:o  o   o o:
|o o   o  o|
|o  ooo   o|
;o   o o  o;
 .o.o.o...
   ,,,,,,
    `````
```
*Smooth brightness mapping from edges (`) through interior*

---

### Example 3: Complex Shape (Heart)

**Original:**
```
  /\   /\
 /  \ /  \
|    |    |
|    |    |
 \  / \  /
  \/   \/
```

**Contour Mode (intensity 80%):**
```
  ##   ##
 #  @ @  #
|    |    |
|    |    |
 @  @ @  @
  ##   ##
```
*Contour detection highlights the shape's boundary clearly*

**Brightness Mode (intensity 80%):**
```
  ||   ||
 |  : :  |
o    |    o
o    |    o
 :  : :  :
  \\   \\
```
*Dense characters (|) in branching areas; lighter (`) in sparse regions*

---

## Character Ramp Reference

### Brightness Scale (Visual Progression)

```
Lightest ────────────────────────────── Darkest

.      (space) . , ` ' ^ _

Light  ────────────────────────────── Dark
       - ~ : ; ! | / \ c l o O 0 x X S @ # % &
```

### Theme-Specific Ramps

**Lunar Theme** (auto-selected for moons):
```
. o O 0 @ #
```
Preserves circular/orbital shapes while adding tone variation

**Standard Theme** (general use):
```
. , : ; ! | c o O @ #
```
Good balance for most ASCII art

**Dramatic Theme** (complexity > 6):
```
. ` ^ - ~ ! / \ x S @ % #
```
High contrast for detailed artwork

---

## Intensity Effects

### Same Mode, Different Intensities

**Mode: Shadow, shadowDepth: 75%**

**Intensity 0% (No Effect):**
```
 /\
|  |
 \/
```

**Intensity 25%:**
```
 /\
|  |
 \/
```
*Slight darkening of edges*

**Intensity 50%:**
```
 |  (faint edge darkening)
|  |
 |  
```

**Intensity 100%:**
```
 @#
#  #
 ##
```
*Maximum shadow effect*

---

## Shadow Depth Effects

**Mode: Shadow, Intensity: 50%**

**ShadowDepth 20% (Subtle):**
```
 /\
|  |
 \/
```
*Minimal edge darkening*

**ShadowDepth 50% (Moderate):**
```
 |  (visible edge marks)
|  |
 |  
```

**ShadowDepth 100% (Maximum):**
```
 @#
#  #
 ##
```
*Strong shadow presence*

---

## Use Case Recommendations

| Mode | Best For | Example |
|------|----------|---------|
| **Brightness** | Varied density art | Landscapes, abstract |
| **Shadow** | Circular/round designs | Moons, spheres, planets |
| **Tone-Map** | Smooth gradients | Portraits, organic shapes |
| **Contour** | Complex multi-part | Multiple moons, constellations |

---

## Real Moon Examples

### Moon #1 Base (Simple Circle)

**Original:**
```
    (((
   (   )
  (     )
  (     )
   (   )
    )))
```

**With Shadow (intensity: 60%, shadowDepth: 70%):**
```
    ###
   @   @
  @     @
  @     @
   @   @
    ###
```

**With Tone-Map (intensity: 60%):**
```
    ;;;
   :   :
  ,     ,
  ,     ,
   :   :
    ;;;
```

---

## Before/After Comparison Matrix

| Original | Brightness | Shadow | Tone-Map | Contour |
|----------|-----------|--------|----------|---------|
| `  (  )` | `  (  )` | `  @  @` | `  ;  ;` | `  #  #` |
| Simple  | Subtle | Deep | Smooth | Edge |

---

## Edge Cases

### Very Sparse ASCII
```
Original: .     .

Tone-Map:  '     '
```
Mostly spaces get minimal effect

### Very Dense ASCII
```
Original: ########

Brightness: ########
Shadow:     ########
```
All-dark areas stay dark (already at max)

### Mixed Density
```
Original:  . o O @
Shadow:    . @ # #
```
Best example for shadow mode - edges get darker (#) while medium stays same (o, O)

---

## Tips for Best Results

1. **Shadow Mode**: Works best when your ASCII has clear empty spaces around shapes
2. **Tone-Map**: Requires varying density throughout (can't be all uniform)
3. **Contour**: Most effective with distinct regions of high and low density
4. **Intensity**: Start at 50% and adjust ±25% based on preference
5. **ShadowDepth**: 60-80% is usually optimal for moons

## Seed Reproducibility

All examples are deterministic:
```typescript
const same1 = renderASCII(art, 'shadow', seed: 'moon-v1')
const same2 = renderASCII(art, 'shadow', seed: 'moon-v1')
// same1 === same2, always
```

This ensures NFT reproducibility for advent calendar drops.
