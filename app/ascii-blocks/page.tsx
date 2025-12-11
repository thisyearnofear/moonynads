import { AsciiBlockPreview } from "@/components/ascii/ascii-block-preview";

const SIMPLE_MOON = `
    .....
   .......
  .........
 ...........
...........
 ...........
  .........
   .......
    .....
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

const BANNER_STYLE = `
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░  Welcome to MOONYNADS  ░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
`;

export default function AsciiBlocksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
            🌙 Block Character ASCII
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Rich colored fills with Unicode block characters (░▒▓█) for stunning visual ASCII art
          </p>
        </div>

        {/* Quick Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🎨</div>
            <h3 className="text-white font-semibold mb-1">5 Palettes</h3>
            <p className="text-gray-300 text-sm">Moon, Fire, Forest, Grayscale, Sunset</p>
          </div>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">█░▒▓</div>
            <h3 className="text-white font-semibold mb-1">Block Chars</h3>
            <p className="text-gray-300 text-sm">Shading, solid, gradient, pattern</p>
          </div>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🎬</div>
            <h3 className="text-white font-semibold mb-1">Live Preview</h3>
            <p className="text-gray-300 text-sm">Canvas rendering with colors</p>
          </div>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">⬇️</div>
            <h3 className="text-white font-semibold mb-1">Export</h3>
            <p className="text-gray-300 text-sm">HTML, PNG, or plain text</p>
          </div>
        </div>

        {/* Simple Example */}
        <div className="mb-12">
          <AsciiBlockPreview
            baseArt={SIMPLE_MOON.trim()}
            title="Simple Moon - Try Solid Coloring"
          />
        </div>

        {/* Detailed Example */}
        <div className="mb-12">
          <AsciiBlockPreview
            baseArt={DETAILED_MOON.trim()}
            title="Detailed Moon - Try Gradient Mode"
          />
        </div>

        {/* Information Section */}
        <div className="space-y-6">
          {/* What is Block Character Rendering? */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">What is Block Character Rendering?</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Block character rendering transforms ASCII art by replacing standard characters with Unicode block elements
                (░▒▓█) and adding full-color backgrounds. This creates a much richer, more visually appealing aesthetic compared
                to plain monochrome ASCII.
              </p>
              <p>
                Instead of just text on black, you get:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Actual colored fills based on line density</li>
                <li>Multiple render modes (shading, solid, gradient)</li>
                <li>5 hand-crafted color palettes</li>
                <li>Tunable intensity and contrast</li>
                <li>Real-time canvas preview</li>
                <li>Export to HTML, PNG, or plain text</li>
              </ul>
            </div>
          </div>

          {/* Examples of Block Characters */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Block Character Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Shade Blocks (Lightest → Darkest)</h3>
                <div className="bg-black/50 border border-white/20 rounded p-6 font-mono text-2xl space-y-2">
                  <div className="text-gray-300">Space (empty)</div>
                  <div className="text-gray-400">░ Light shade</div>
                  <div className="text-gray-500">▒ Medium shade</div>
                  <div className="text-gray-600">▓ Dark shade</div>
                  <div className="text-white">█ Solid block</div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Palette Examples</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-900 to-blue-300 rounded" />
                    <div>
                      <p className="font-semibold text-white">Moon</p>
                      <p className="text-sm text-gray-400">Cool lunar blues</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-900 to-yellow-300 rounded" />
                    <div>
                      <p className="font-semibold text-white">Fire</p>
                      <p className="text-sm text-gray-400">Warm reds & golds</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-900 to-green-300 rounded" />
                    <div>
                      <p className="font-semibold text-white">Forest</p>
                      <p className="text-sm text-gray-400">Natural greens</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-900 to-gray-100 rounded" />
                    <div>
                      <p className="font-semibold text-white">Grayscale</p>
                      <p className="text-sm text-gray-400">Classic B&W</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How to Use */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
            <ol className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="font-bold text-blue-400">1.</span>
                <span>Choose a render mode (Shading, Solid, Gradient)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-400">2.</span>
                <span>Select a color palette (Moon, Fire, Forest, etc)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-400">3.</span>
                <span>Adjust intensity (0-100%) and contrast level</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-400">4.</span>
                <span>Preview in real-time on the canvas</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-400">5.</span>
                <span>Download as HTML (with colors), PNG, or plain text</span>
              </li>
            </ol>
          </div>

          {/* Tips */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">💡 Pro Tips</h2>
            <ul className="space-y-2 text-gray-300">
              <li>✓ <strong>Solid mode</strong> works best for bold, high-contrast designs</li>
              <li>✓ <strong>Gradient mode</strong> is perfect for smooth transitions and landscapes</li>
              <li>✓ <strong>Shading mode</strong> preserves the original ASCII while adding tone</li>
              <li>✓ Start with <strong>intensity at 60%</strong> and adjust from there</li>
              <li>✓ Try all <strong>5 palettes</strong> - the same art looks completely different</li>
              <li>✓ <strong>Export as HTML</strong> preserves colors for web display</li>
              <li>✓ <strong>Export as PNG</strong> gives you a high-quality image file</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
