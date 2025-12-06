"use client";

import { useState } from "react";
import {
  useAsciiGenerator,
  getAvailableBaseDesigns,
} from "@/hooks/ascii/use-ascii-generator";
import { ASCIIAnimator } from "./ascii-animator";
import { useAnimationState } from "@/hooks/ui/use-animation-state";
// Basic HTML elements instead of shadcn/ui components to prevent bloat

export function AsciiGeneratorPreview() {
  const { ascii, isGenerating, error, generate, lastParams } =
    useAsciiGenerator();
  const animationState = useAnimationState();

  const [baseDesign, setBaseDesign] = useState("moon");
  const [variation, setVariation] = useState<
    "subtle" | "moderate" | "dramatic"
  >("subtle");
  const [complexity, setComplexity] = useState(3);
  const [seed, setSeed] = useState(`preview-${Date.now()}`);

  const availableDesigns = getAvailableBaseDesigns();

  const handleGenerate = async () => {
    await generate({
      seed,
      baseDesign,
      variation,
      complexity,
      preserveTheme: true,
    });
  };

  const handleRandomize = () => {
    const randomDesign =
      availableDesigns[Math.floor(Math.random() * availableDesigns.length)].id;
    const randomVariation = ["subtle", "moderate", "dramatic"][
      Math.floor(Math.random() * 3)
    ] as any;
    const randomComplexity = Math.floor(Math.random() * 8) + 3;
    const randomSeed = `random-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`;

    setBaseDesign(randomDesign);
    setVariation(randomVariation);
    setComplexity(randomComplexity);
    setSeed(randomSeed);
  };

  const handleDownload = () => {
    if (ascii) {
      const blob = new Blob([ascii.art], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ascii-${baseDesign}-${seed}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Convert ASCII art to data URI for ASCIIAnimator
  const getAsciiDataUri = (art: string) => {
    return `data:text/plain;charset=utf-8,${encodeURIComponent(art)}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            ASCII Art Generator
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Generate unique ASCII art variations based on existing pant designs
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="base-design"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Base Design
              </label>
              <select
                id="base-design"
                value={baseDesign}
                onChange={(e) => setBaseDesign(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableDesigns.map((design) => (
                  <option key={design.id} value={design.id}>
                    {design.name} ({design.rarity})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="variation"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Variation Level
              </label>
              <select
                id="variation"
                value={variation}
                onChange={(e) =>
                  setVariation(
                    e.target.value as "subtle" | "moderate" | "dramatic"
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="subtle">Subtle (1-2 changes)</option>
                <option value="moderate">Moderate (3-5 changes)</option>
                <option value="dramatic">Dramatic (6+ changes)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="complexity"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Complexity: {complexity}
            </label>
            <input
              id="complexity"
              type="range"
              min={1}
              max={10}
              step={1}
              value={complexity}
              onChange={(e) => setComplexity(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Higher complexity adds more variations and details
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="seed"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Generation Seed
            </label>
            <div className="flex gap-2">
              <input
                id="seed"
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter seed for deterministic generation"
              />
              <button
                type="button"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setSeed(`seed-${Date.now()}`)}
              >
                ↻
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isGenerating ? "Generating..." : "Generate ASCII"}
            </button>
            <button
              type="button"
              onClick={handleRandomize}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              🔀 Randomize
            </button>
            {ascii && (
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                ⬇ Download
              </button>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              Error: {error}
            </div>
          )}
        </div>
      </div>

      {ascii && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Generated ASCII Art
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Variation of{" "}
              {availableDesigns.find((d) => d.id === baseDesign)?.name} with{" "}
              {variation} changes
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm whitespace-pre overflow-x-auto">
                {ascii.art}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Base Design:
                  </span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {ascii.metadata.baseDesign}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Variation:
                  </span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {ascii.metadata.variation}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Changes:
                  </span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {ascii.metadata.changes}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Theme Preservation:
                  </span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {Math.round(ascii.metadata.themePreservation * 100)}%
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Animation Preview
                </h4>
                <div className="border rounded-lg p-4 bg-white dark:bg-gray-900">
                  <ASCIIAnimator
                    src={getAsciiDataUri(ascii.art)}
                    pantId={baseDesign}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {lastParams && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Generation Parameters
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Settings used for the last generation
            </p>
          </div>
          <div className="p-6">
            <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded-lg overflow-x-auto text-gray-900 dark:text-white">
              {JSON.stringify(lastParams, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
