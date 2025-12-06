import { generateAsciiArt } from '@/lib/ascii-generator'

const baseDesigns = ['moon', 'heart', 'lady', 'chudnovsky']
const testSeeds = ['dramatic1', 'dramatic2', 'dramatic3']

async function runDramaticTests() {
  console.log('🧪 Testing Dramatic Variations Only')
  console.log('====================================')

  for (const design of baseDesigns) {
    console.log(`\n🎨 Testing Base Design: ${design.toUpperCase()}`)
    console.log('─'.repeat(40))
    
    for (const seed of testSeeds) {
      try {
        const result = await generateAsciiArt({
          seed: `${seed}-${design}-dramatic`,
          baseDesign: design,
          variation: 'dramatic',
          complexity: 3,
          preserveTheme: true
        })
        
        console.log(`\n📝 Seed: ${seed}`)
        console.log(`📊 Theme Preservation: ${result.metadata.themePreservation}%`)
        console.log(`🔢 Changes: ${result.metadata.changes}`)
        console.log(`🎭 Generated Art:`)
        console.log(result.art)
        
        // Validate theme preservation
        if (result.metadata.themePreservation < 70) {
          console.log(`⚠️  WARNING: Low theme preservation for ${design}`)
        } else {
          console.log(`✅ Theme preservation acceptable`)
        }
        
      } catch (error) {
        console.log(`❌ Error generating ${design}:`, error)
      }
    }
  }

  console.log('\n✅ Dramatic variation testing complete!')
}

// Run the tests
runDramaticTests().catch(console.error)