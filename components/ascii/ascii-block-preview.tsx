"use client";

import { useState } from "react";
import { useBlockCharacters, getBlockModeDescription, getPaletteDescription, type ColorPalette } from "@/hooks/ascii/use-block-characters";

interface AsciiBlockPreviewProps {
  baseArt: string;
  title?: string;
}

export function AsciiBlockPreview({ baseArt, title = "Block Character ASCII Preview" }: AsciiBlockPreviewProps) {
  const blockChars = useBlockCharacters({
    baseArt,
    mode: "solid",
    palette: "moon",
    intensity: 60,
    contrastLevel: 70,
  });

  const [showComparison, setShowComparison] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg shadow-xl border border-blue-700 p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">🎨 {title}</h2>
        <p className="text-blue-200">
          Rich colored fills with block characters (░▒▓█) - much more visual than plain ASCII
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mode Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Render Mode
            </label>
            <select
              value={blockChars.mode}
              onChange={(e) => blockChars.setMode(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {blockChars.modes.map((m) => (
                <option key={m} value={m}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getBlockModeDescription(blockChars.mode)}
            </p>
          </div>

          {/* Palette Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Color Palette
            </label>
            <select
              value={blockChars.palette}
              onChange={(e) => blockChars.setPalette(e.target.value as ColorPalette)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {blockChars.palettes.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getPaletteDescription(blockChars.palette as ColorPalette)}
            </p>
          </div>
        </div>

        {/* Sliders */}
        {blockChars.mode !== "none" && (
          <>
            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Intensity
                </label>
                <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {blockChars.intensity}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={blockChars.intensity}
                onChange={(e) => blockChars.setIntensity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contrast Level
                </label>
                <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {blockChars.contrastLevel}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={blockChars.contrastLevel}
                onChange={(e) => blockChars.setContrastLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
            </div>
          </>
        )}

        {/* Toggle and Download Buttons */}
        <div className="border-t pt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showComparison ? "Hide Original" : "Show Original"}
          </button>
          <button
            onClick={blockChars.downloadAsText}
            disabled={blockChars.mode === "none"}
            className="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            ⬇ Download TXT
          </button>
          <button
            onClick={blockChars.downloadAsHTML}
            disabled={blockChars.mode === "none"}
            className="px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            ⬇ Download HTML
          </button>
          <button
            onClick={blockChars.downloadCanvasPNG}
            disabled={blockChars.mode === "none"}
            className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            ⬇ Download PNG
          </button>
        </div>
      </div>

      {/* Display Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Canvas Render (Colored) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <h3 className="font-semibold">Colored Render</h3>
            <p className="text-xs opacity-90">Canvas-based rendering with actual colors</p>
          </div>
          <div className="p-4 bg-black flex justify-center items-start overflow-auto max-h-96">
            <canvas
              ref={blockChars.canvasRef}
              className="border border-gray-600"
            />
          </div>
        </div>

        {/* Text Version */}
        {showComparison && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <h3 className="font-semibold">Text Version (ASCII)</h3>
              <p className="text-xs opacity-90">Block characters as plain text</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-900 overflow-auto max-h-96">
              <pre className="font-mono text-xs whitespace-pre overflow-x-auto text-gray-900 dark:text-gray-100">
                {blockChars.art}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Original for comparison */}
      {showComparison && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-500 text-white">
            <h3 className="font-semibold">Original ASCII</h3>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-900 overflow-auto max-h-60">
            <pre className="font-mono text-xs whitespace-pre overflow-x-auto text-gray-900 dark:text-gray-100">
              {baseArt}
            </pre>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
          💡 Block Character Features
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
          <li>✓ <strong>Canvas Rendering:</strong> Real colors with color palettes (moon, fire, forest, etc)</li>
          <li>✓ <strong>Block Characters:</strong> Uses ░▒▓█ for visual depth and shading</li>
          <li>✓ <strong>Multiple Modes:</strong> Shading, solid fills, gradients, patterns</li>
          <li>✓ <strong>Export Options:</strong> Download as HTML, PNG, or plain text</li>
          <li>✓ <strong>Tunable:</strong> Intensity and contrast adjustments</li>
        </ul>
      </div>

      {/* Mode Guide */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Mode Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Shading</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Light blocks (░) to dark (█) - traditional ASCII shading
            </p>
            <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded">
░▒▓█
            </pre>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Solid</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Full line backgrounds with colored fills
            </p>
            <div className="mt-2 h-8 bg-blue-500 rounded" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Gradient</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Multi-level color gradients across density
            </p>
            <div className="mt-2 h-8 bg-gradient-to-r from-gray-700 to-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
