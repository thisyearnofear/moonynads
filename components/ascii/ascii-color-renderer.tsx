"use client";

import { useState } from "react";
import { useColorAwareAscii, getColorAwareModeLabel, getColorAwareModeDescription, type ColorAwareMode } from "@/hooks/ascii/use-color-aware-ascii";

interface AsciiColorRendererProps {
  baseArt: string;
  title?: string;
  enableMode?: ColorAwareMode;
}

export function AsciiColorRenderer({
  baseArt,
  title = "Color-Aware ASCII Rendering",
  enableMode = "none"
}: AsciiColorRendererProps) {
  const [mode, setMode] = useState<ColorAwareMode>(enableMode);
  const [intensity, setIntensity] = useState(50);
  const [shadowDepth, setShadowDepth] = useState(50);
  const [seed, setSeed] = useState("demo-seed");

  const colorAware = useColorAwareAscii({
    baseArt,
    mode,
    intensity,
    shadowDepth,
    seed,
  });

  const downloadArt = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const modes: ColorAwareMode[] = ["none", "brightness", "shadow", "tone-map", "contour"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            🎨 {title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Apply color-aware ASCII transformations to enhance visual depth
          </p>
        </div>

        {/* Controls */}
        <div className="p-6 space-y-4">
          {/* Mode Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Rendering Mode
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {modes.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                    mode === m
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  title={getColorAwareModeDescription(m)}
                >
                  {m === "tone-map" ? "Tone Map" : m === "none" ? "None" : m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {getColorAwareModeDescription(mode)}
            </p>
          </div>

          {mode !== "none" && (
            <>
              {/* Intensity Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Intensity
                  </label>
                  <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {intensity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  How strongly the color mode affects character selection
                </p>
              </div>

              {/* Shadow Depth Slider (for shadow mode) */}
              {mode === "shadow" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Shadow Depth
                    </label>
                    <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {shadowDepth}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={shadowDepth}
                    onChange={(e) => setShadowDepth(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Darkness of shadow effects on edges
                  </p>
                </div>
              )}

              {/* Seed Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Color Seed (for variation modes)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Deterministic seed"
                  />
                  <button
                    onClick={() => setSeed(`seed-${Math.random().toString(36).slice(2, 9)}`)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    🔀
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Analysis Info */}
          {colorAware.canApplyColor && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md text-sm">
              <div className="font-medium text-blue-900 dark:text-blue-200 mb-1">✓ Suitable for Color Rendering</div>
              <div className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                <div>• Average density: {colorAware.analysis.averageDensity.toFixed(0)}%</div>
                <div>• Max density: {colorAware.analysis.maxDensity.toFixed(0)}%</div>
                {colorAware.analysis.hasMoonElements && <div>• Contains lunar elements</div>}
                {colorAware.analysis.hasAngularElements && <div>• Contains angular elements</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-white">Original ASCII</h3>
          </div>
          <div className="p-4">
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded font-mono text-[10px] md:text-xs whitespace-pre overflow-x-auto max-h-96">
              {baseArt}
            </div>
            <button
              onClick={() => downloadArt(baseArt, "ascii-original.txt")}
              className="mt-3 w-full px-3 py-2 text-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              ⬇ Download Original
            </button>
          </div>
        </div>

        {/* Colored Version */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {getColorAwareModeLabel(mode)}
            </h3>
            {mode !== "none" && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Intensity: {intensity}% {mode === "shadow" && `| Shadow: ${shadowDepth}%`}
              </p>
            )}
          </div>
          <div className="p-4">
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded font-mono text-[10px] md:text-xs whitespace-pre overflow-x-auto max-h-96">
              {colorAware.coloredArt}
            </div>
            <button
              onClick={() =>
                downloadArt(
                  colorAware.coloredArt,
                  `ascii-${mode}.txt`
                )
              }
              className="mt-3 w-full px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={mode === "none"}
            >
              ⬇ Download {mode === "none" ? "Original" : "Rendered"}
            </button>
          </div>
        </div>
      </div>

      {/* Mode Descriptions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Mode Descriptions</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Brightness</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Varies character density based on how packed each line is. Dense lines get darker characters.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Tone Map</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Maps line density to a brightness ramp. Creates smooth transitions from light to dark.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Shadow</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Darkens edges and characters surrounded by spaces, creating a shadow/depth effect.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Contour</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Highlights density changes to reveal the contours and edges of shapes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
