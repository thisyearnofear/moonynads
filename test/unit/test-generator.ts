import { generateAsciiArt } from '@/lib/ascii-generator'

const baseDesigns = ['moon', 'moon2', 'moon3', 'heart', 'lady', 'chudnovsky', 'headupbutt', 'multi', 'xl']
const testSeeds = ['test123', 'abc456', 'xyz789']
const variations: ('subtle' | 'moderate' | 'dramatic')[] = ['subtle', 'moderate', 'dramatic']

async function runGeneratorTests() {
  console.log('🧪 Testing Template-Based ASCII Generator')
  console.log('==========================================')

  for (const design of baseDesigns) {
    console.log(`\n🎨 Testing Base Design: ${design.toUpperCase()}`)
    console.log('─'.repeat(40))
    
    for (const seed of testSeeds) {
      for (const variation of variations) {
        try {
          const result = await generateAsciiArt({
            seed: `${seed}-${design}-${variation}`,
            baseDesign: design,
            variation,
            complexity: 3,
            preserveTheme: true
          })
          
          console.log(`\n📝 Seed: ${seed} | Variation: ${variation.toUpperCase()}`)
          console.log(`📊 Theme Preservation: ${result.metadata.themePreservation}%`)
          console.log(`🔢 Changes: ${result.metadata.changes}`)
          console.log(`🎭 Generated Art:`)
          console.log(result.art)
          
          // Validate theme preservation
          if (result.metadata.themePreservation < 70) {
            console.log(`⚠️  WARNING: Low theme preservation for ${design} with ${variation} variation`)
          } else {
            console.log(`✅ Theme preservation acceptable`)
          }
          
        } catch (error) {
          console.log(`❌ Error generating ${design} with ${variation} variation:`, error)
        }
      }
    }
  }

  console.log('\n✅ Generator testing complete!')
}

// Run the tests
runGeneratorTests().catch(console.error)