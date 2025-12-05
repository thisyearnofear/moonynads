#!/usr/bin/env node

/**
 * Generate animation frames for ASCII art designs
 * Creates simple wave/pulse effects for designs without frames
 */

const fs = require('fs');
const path = require('path');

const PANTS_DIR = path.join(__dirname, '../public/pants');

// Designs that need frames
const DESIGNS_TO_ANIMATE = [
  'moon',
  'moon2',
  'moon3',
  'heart',
  'lady',
  'chudnovsky',
  'headupbutt',
  'l',
  'm',
  'multi',
  's',
  'xl'
];

const NUM_FRAMES = 4;

function generateWaveFrames(content, numFrames = 4) {
  const lines = content.split('\n');
  const frames = [];
  
  for (let f = 0; f < numFrames; f++) {
    const phase = (f / numFrames) * Math.PI * 2;
    const shifted = lines.map((line, i) => {
      const offset = Math.floor(Math.sin(phase + i * 0.3) * 2);
      if (offset > 0) {
        return ' '.repeat(offset) + line;
      } else if (offset < 0) {
        return line.slice(Math.abs(offset));
      }
      return line;
    });
    frames.push(shifted.join('\n'));
  }
  
  return frames;
}

function generatePulseFrames(content, numFrames = 4) {
  const lines = content.split('\n');
  const frames = [];
  
  for (let f = 0; f < numFrames; f++) {
    const phase = (f / numFrames) * Math.PI * 2;
    const scale = 1 + Math.sin(phase) * 0.1;
    
    // Simple pulse: add/remove spaces
    const pulsed = lines.map(line => {
      if (scale > 1) {
        return ' ' + line;
      }
      return line;
    });
    frames.push(pulsed.join('\n'));
  }
  
  return frames;
}

function main() {
  console.log('🎬 Generating animation frames...\n');
  
  for (const design of DESIGNS_TO_ANIMATE) {
    const filePath = path.join(PANTS_DIR, `${design}.txt`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${design} - file not found`);
      continue;
    }
    
    // Check if frames already exist
    const frame1Path = path.join(PANTS_DIR, `${design}-frame-1.txt`);
    if (fs.existsSync(frame1Path)) {
      console.log(`✓ ${design} - frames already exist`);
      continue;
    }
    
    // Read original content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Generate frames (alternate between wave and pulse)
    const useWave = DESIGNS_TO_ANIMATE.indexOf(design) % 2 === 0;
    const frames = useWave 
      ? generateWaveFrames(content, NUM_FRAMES)
      : generatePulseFrames(content, NUM_FRAMES);
    
    // Write frames
    frames.forEach((frame, i) => {
      const framePath = path.join(PANTS_DIR, `${design}-frame-${i + 1}.txt`);
      fs.writeFileSync(framePath, frame, 'utf8');
    });
    
    console.log(`✓ ${design} - generated ${NUM_FRAMES} frames (${useWave ? 'wave' : 'pulse'})`);
  }
  
  console.log('\n✨ Frame generation complete!');
}

main();
