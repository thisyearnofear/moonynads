// Simple test for ASCII generator - runs directly with Node.js
const { AsciiGenerator } = require("../dist/ascii-generator");

console.log("🌙 ASCII Generator Quick Test");
console.log("=".repeat(40));

// Test basic functionality
const seed = "test-seed-123";
const generator = new AsciiGenerator({ seed, complexity: 5, density: 0.3 });
const result = generator.generate();

console.log("\n✅ Basic Generation Test:");
console.log(`Seed: ${seed}`);
console.log(`Art Length: ${result.art.length} characters`);
console.log(`Unique Characters: ${result.metadata.uniqueChars.join(", ")}`);

// Test determinism
const generator2 = new AsciiGenerator({ seed, complexity: 5, density: 0.3 });
const result2 = generator2.generate();

console.log(`\n✅ Determinism Test:`);
console.log(`Same seed produces same result: ${result.art === result2.art}`);

// Test different styles
const styles = ["lunar", "geometric", "organic", "abstract"];
console.log(`\n✅ Style Testing:`);
styles.forEach((style) => {
  const gen = new AsciiGenerator({
    seed: `${seed}-${style}`,
    style,
    complexity: 4,
  });
  const res = gen.generate();
  console.log(`${style}: ${res.metadata.uniqueChars.length} unique chars`);
});

// Show sample output
console.log(`\n✅ Sample ASCII Art:`);
console.log("─".repeat(40));
console.log(result.art);
console.log("─".repeat(40));

console.log("\n🌙 ASCII Generator Ready for Integration!");
