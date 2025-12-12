import { generateAsciiArt } from '@/lib/ascii-generator'

const baseDesigns = ['moon', 'moon2', 'moon3', 'heart', 'lady', 'chudnovsky', 'headupbutt', 'multi', 'xl']
const variations: ('subtle' | 'moderate' | 'dramatic')[] = ['subtle', 'moderate', 'dramatic']

async function runFinalTests() {
  console.log('🧪 Final Comprehensive Test - All Designs & Variations')
  console.log('======================================================')

  let totalTests = 0
  let passedTests = 0
  let failedTests = 0

  for (const design of baseDesigns) {
    console.log(`\n🎨 Testing Base Design: ${design.toUpperCase()}`)
    console.log('─'.repeat(50))
    
    for (const variation of variations) {
      try {
        const result = await generateAsciiArt({
          seed: `final-test-${design}-${variation}`,
          baseDesign: design,
          variation,
          complexity: 3,
          preserveTheme: true
        })
        
        totalTests++
        
        console.log(`\n📝 ${variation.toUpperCase()} Variation:`)
        console.log(`   📊 Theme Preservation: ${result.metadata.themePreservation}%`)
        console.log(`   🔢 Changes Made: ${result.metadata.changes}`)
        
        // Validate theme preservation
        if (result.metadata.themePreservation >= 70) {
          passedTests++
          console.log(`   ✅ PASSED - Theme preservation acceptable`)
        } else {
          failedTests++
          console.log(`   ❌ FAILED - Low theme preservation`)
          console.log(`   🎭 Sample: ${result.art.split('\n')[0].substring(0, 30)}...`)
        }
        
      } catch (error) {
        failedTests++
        totalTests++
        console.log(`   ❌ ERROR: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  }

  console.log('\n📊 FINAL RESULTS')
  console.log('================')
  console.log(`Total Tests: ${totalTests}`)
  console.log(`Passed: ${passedTests} (${Math.round((passedTests/totalTests) * 100)}%)`)
  console.log(`Failed: ${failedTests} (${Math.round((failedTests/totalTests) * 100)}%)`)

  if (failedTests === 0) {
    console.log('🎉 ALL TESTS PASSED! The generator successfully preserves themes across all designs and variations.')
  } else {
    console.log('⚠️  Some tests failed. Review the failed cases above.')
  }
}

// Run the tests
runFinalTests().catch(console.error)