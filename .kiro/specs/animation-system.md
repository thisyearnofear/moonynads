# Animation System Specification

## Overview
Build a canvas-based animation engine for ASCII art with real-time preview, recording, and persistent state management.

## Requirements

### Core Features
1. **Animation Modes** (7 types)
   - lineWave: Vertical wave effect per line
   - blockSway: Horizontal sway in blocks
   - colorCycle: Color transitions
   - glitch: Random character displacement
   - pulse: Scale pulsing
   - rotate: Character rotation
   - typewriter: Sequential reveal

2. **Color Palettes** (4 options)
   - yellow: #fbbf24
   - green: #10b981
   - blue: #3b82f6
   - rainbow: Gradient cycling

3. **Controls**
   - Speed: 0.1x to 3x
   - Amplitude: 0 to 100
   - Target character/set selection
   - Play/Pause toggle

4. **Recording**
   - WebM video export
   - Configurable FPS (30/60)
   - PNG snapshot export

5. **Persistence**
   - localStorage per design
   - Auto-save on setting change
   - Restore on page load

## Technical Architecture

### Hook Structure
```typescript
// State management
useAnimationState(designId: string)
  - Manages animation settings
  - localStorage persistence
  - Returns: [state, setState]

// Recording functionality
useAnimationRecorder(canvasRef: RefObject<HTMLCanvasElement>)
  - MediaRecorder API integration
  - WebM blob generation
  - Returns: { startRecording, stopRecording, isRecording }

// Upload functionality
useAnimationUpload()
  - Storage provider integration
  - Metadata capture
  - Returns: { uploadSnapshot, uploadAnimation, isUploading }
```

### Component Structure
```typescript
<AsciiAnimator
  designId={string}
  frames={string[]}
  initialSettings={AnimationSettings}
/>
```

### Data Flow
1. Load ASCII frames from `/public/pants/{id}/`
2. Initialize canvas with frame dimensions
3. Apply animation mode transformation
4. Render to canvas at 60fps
5. Capture user interactions
6. Persist state to localStorage
7. Record/export on demand

## Implementation Notes

### Canvas Rendering
- Use `requestAnimationFrame` for smooth 60fps
- Calculate character positions based on monospace font
- Apply transformations per animation mode
- Handle color palette application

### State Persistence
```typescript
interface AnimationSettings {
  mode: AnimationMode
  palette: ColorPalette
  speed: number
  amplitude: number
  targetChars: string
  isPlaying: boolean
}

// Storage key: `animation-${designId}`
```

### Recording Strategy
- Use MediaRecorder with canvas.captureStream()
- Collect chunks in array
- Create Blob on stop
- Generate download URL

## Success Criteria
- [ ] Smooth 60fps animation
- [ ] All 7 modes working correctly
- [ ] Settings persist across sessions
- [ ] Recording produces valid WebM
- [ ] Responsive on mobile devices
- [ ] No memory leaks on long sessions

## Kiro Implementation Notes
- Built iteratively through vibe coding
- Extracted hooks after initial monolithic component
- Optimized rendering performance through profiling
- Added storage integration in separate iteration
