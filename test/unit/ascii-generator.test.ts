import { AsciiGenerator, generateAsciiArt, generateDeterministicAscii, generateAsciiBatch } from '@/lib/ascii-generator'

/**
 * Test suite for ASCII deterministic generator
 * Validates determinism, collision rates, and generation quality
 */

async function runTests() {
  console.log('🌙 ASCII Generator Test Suite')
  console.log('=' .repeat(50))

  // Test 1: Basic Determinism
  console.log('\n1. Testing Determinism...')
  const seed = 'test-seed-123'
  const result1 = await generateDeterministicAscii(seed)
  const result2 = await generateDeterministicAscii(seed)

  console.log(`   Seed: ${seed}`)
  console.log(`   Deterministic: ${result1.art === result2.art ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`   Art Length: ${result1.art.length} characters`)
  console.log(`   Metadata: ${JSON.stringify(result1.metadata)}`)

  // Test 2: Different Styles
  console.log('\n2. Testing Different Styles...')
  const styles = ['moon', 'moon2', 'moon3', 'chudnovsky'] as const
  for (const style of styles) {
    const result = await generateDeterministicAscii(`${seed}-${style}`, style)
    console.log(`   ${style}: ${result.metadata.baseDesign} base, ${result.metadata.variation} variation`)
  }

  // Test 3: Collision Testing
  console.log('\n3. Testing Collision Rates...')
  const testSeeds = Array.from({ length: 100 }, (_, i) => `collision-test-${i}`)
  const collisionResult = await AsciiGenerator.testCollisionRate(testSeeds)
  console.log(`   Total Tests: ${collisionResult.total}`)
  console.log(`   Collisions: ${collisionResult.collisions}`)
  console.log(`   Collision Rate: ${(collisionResult.rate * 100).toFixed(2)}%`)
  console.log(`   Result: ${collisionResult.rate < 0.01 ? '✅ EXCELLENT' : collisionResult.rate < 0.05 ? '✅ GOOD' : '⚠️  HIGH'}`)

  // Test 4: Complex Generation
  console.log('\n4. Testing Complex Generation...')
  const complexParams = {
    seed: 'complex-test',
    baseDesign: 'moon',
    variation: 'dramatic' as const,
    complexity: 8,
    preserveTheme: true
  }
  const complexResult = await generateAsciiArt(complexParams)
  console.log(`   Complexity: ${complexResult.metadata.complexity}/10`)
  console.log(`   Base Design: ${complexResult.metadata.baseDesign}`)
  console.log(`   Variation: ${complexResult.metadata.variation}`)
  console.log(`   Changes: ${complexResult.metadata.changes}`)

  // Test 5: Batch Generation
  console.log('\n5. Testing Batch Generation...')
  const batchStart = Date.now()
  const batchResults = await generateAsciiBatch(10, 'moon')
  const batchTime = Date.now() - batchStart
  console.log(`   Generated 10 ASCII arts in ${batchTime}ms`)
  console.log(`   Average time per generation: ${(batchTime / 10).toFixed(2)}ms`)

  // Test 6: Performance Validation
  console.log('\n6. Testing Performance...')
  const perfStart = Date.now()
  let totalChars = 0
  for (let i = 0; i < 100; i++) {
    const result = await generateDeterministicAscii(`perf-test-${i}`)
    totalChars += result.art.length
  }
  const perfTime = Date.now() - perfStart
  console.log(`   Generated 100 ASCII arts in ${perfTime}ms`)
  console.log(`   Average time per generation: ${(perfTime / 100).toFixed(2)}ms`)
  console.log(`   Performance: ${perfTime / 100 < 10 ? '✅ EXCELLENT' : perfTime / 100 < 50 ? '✅ GOOD' : '⚠️  SLOW'}`)

  // Test 7: Visual Sample Output
  console.log('\n7. Sample ASCII Art Output...')
  const sampleResult = await generateDeterministicAscii('sample-output', 'moon')
  console.log('\n   Generated Art:')
  console.log('   ' + sampleResult.art.split('\n').join('\n   '))
}

// Run the tests
runTests().catch(console.error)