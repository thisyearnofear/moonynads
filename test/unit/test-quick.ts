import { generateAsciiArt } from '@/lib/ascii-generator'

async function runQuickTest() {
  console.log('🧪 Quick Dramatic Test')
  console.log('=====================')

  try {
    const result = await generateAsciiArt({
      seed: 'test-dramatic-moon',
      baseDesign: 'moon',
      variation: 'dramatic',
      complexity: 3,
      preserveTheme: true
    })
    
    console.log(`📊 Theme Preservation: ${result.metadata.themePreservation}%`)
    console.log(`🔢 Changes: ${result.metadata.changes}`)
    console.log(`🎭 Generated Art:`)
    console.log(result.art)
    
    if (result.metadata.themePreservation < 70) {
      console.log(`⚠️  WARNING: Low theme preservation`)
    } else {
      console.log(`✅ Theme preservation acceptable`)
    }
    
  } catch (error) {
    console.log(`❌ Error:`, error)
  }
}

// Run the test
runQuickTest().catch(console.error)