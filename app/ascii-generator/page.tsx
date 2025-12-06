import { AsciiGeneratorPreview } from "@/components/ascii/ascii-generator-preview";

export default function AsciiGeneratorDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🌙 ASCII Art Generator
          </h1>
          <p className="text-lg text-gray-600">
            Deterministic ASCII art generation for Days 13-16
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <AsciiGeneratorPreview />
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">
            🎯 Integration Notes
          </h2>
          <ul className="space-y-2 text-blue-800">
            <li>• Same seed always produces same ASCII art (deterministic)</li>
            <li>• 4 styles available: Lunar, Geometric, Organic, Abstract</li>
            <li>• Complexity (1-10) and Density (10-100%) controls</li>
            <li>• Ready for Day 13-16 mint components</li>
            <li>• Integrates with existing animation system</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
