import { AsciiColorRenderer } from "@/components/ascii/ascii-color-renderer";

// Simple moon ASCII for demo
const DEMO_MOON = `
  .---.
 /     \\
|       |
|   o   |
|       |
 \\     /
  '---'
`;

const DETAILED_MOON = `
      ....
    .....o....
   ..o o o o..
  ..o       o..
 ..o   ooo   o.
 .o   o   o   o
.o    o   o    o
.o    o ooo    o
|o   o       o o|
|oo ooooooooo oo|
| oooooooooooo o|
|o oooooooooo  o|
 .o   ooooo   o.
  ..o       o..
   ..o o o o..
    .....o....
      ....
`;

export default function AsciiColorDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🌙 Color-Aware ASCII Rendering
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Transform ASCII art with intelligent color and shadow effects. Characters are swapped based on brightness, shadow depth, and density mapping.
          </p>
        </div>

        {/* Simple Example */}
        <div className="mb-12">
          <AsciiColorRenderer
            baseArt={DEMO_MOON.trim()}
            title="Simple Moon (Recommended for Shadow Mode)"
            enableMode="none"
          />
        </div>

        {/* Detailed Example */}
        <div className="mb-12">
          <AsciiColorRenderer
            baseArt={DETAILED_MOON.trim()}
            title="Detailed Moon (Try Tone-Map or Contour)"
            enableMode="none"
          />
        </div>

        {/* Feature Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Character Brightness Mapping
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Each ASCII character has an inherent "brightness" value:
              </p>
              <div className="font-mono text-xs space-y-1 bg-gray-100 dark:bg-gray-900 p-3 rounded">
                <div>Lightest: . , ` ' ^ _</div>
                <div>Light: - ~ : ! |</div>
                <div>Medium: o O 0 x c</div>
                <div>Dark: @ # % &</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Rendering Modes
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>
                  <strong>Brightness:</strong> Varies based on line density
                </li>
                <li>
                  <strong>Shadow:</strong> Darkens edges for depth
                </li>
                <li>
                  <strong>Tone Map:</strong> Smooth brightness gradients
                </li>
                <li>
                  <strong>Contour:</strong> Highlights density changes
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Integration Note */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            ℹ️ Integration with ASCII Generator
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
            Color-aware rendering is now integrated into the main ASCII generator. When you generate new ASCII art with a complexity level, you can enable color effects through the new parameters:
          </p>
          <div className="font-mono text-xs bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-700 whitespace-pre-wrap">
{`generate({
  colorMode: 'shadow' | 'brightness' | 'tone-map' | 'contour',
  colorIntensity: 0-100,
  shadowDepth: 0-100
})`}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Tips for Best Results
          </h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex gap-3">
              <span className="text-xl">✓</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Shadow Mode</strong> works best with circular designs (moons) and benefits from higher shadow depth (70-100%)
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-xl">✓</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Tone-Map</strong> creates smooth gradients; ideal for artwork with varied density throughout
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-xl">✓</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Contour</strong> reveals edges and outlines; great for complex shapes with clear boundaries
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-xl">✓</span>
              <div>
                Start with intensity at 50% and adjust based on how subtle or dramatic you want the effect to be
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-xl">✓</span>
              <div>
                Original ASCII integrity is maintained—color modes never lose the underlying structure, only enhance it
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
