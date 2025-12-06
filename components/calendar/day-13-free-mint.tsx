"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useAsciiGenerator } from "@/hooks/ascii/use-ascii-generator";
import { useAnimationState } from "@/hooks/ui/use-animation-state";
import { ASCIIAnimator } from "@/components/ascii/ascii-animator";
import { useAnimationRecorder } from "@/hooks/ui/use-animation-recorder";
import { useAnimationUpload } from "@/hooks/ui/use-animation-upload";

interface Day13FreeMintProps {
  onMintComplete?: (tokenId: string, metadata: any) => void;
  className?: string;
}

/**
 * Day 13 Free Mint Component
 * Community entry point with full animation control
 * Generates unique ASCII art from seed + records custom animations
 */
export function Day13FreeMint({
  onMintComplete,
  className = "",
}: Day13FreeMintProps) {
  const { address } = useAccount();
  const [seed, setSeed] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [hasMinted, setHasMinted] = useState(false);

  // ASCII Generation
  const {
    ascii,
    isGenerating,
    error: generateError,
    generate,
  } = useAsciiGenerator();

  // Animation System
  const animationState = useAnimationState("day-13");
  const recorder = useAnimationRecorder();
  const upload = useAnimationUpload();

  // Generate deterministic seed on component mount
  useEffect(() => {
    if (address) {
      const deterministicSeed = `day13-${address}-${Date.now()}`;
      setSeed(deterministicSeed);
      generate({
        seed: deterministicSeed,
        complexity: 6,
        variation: "dramatic",
        baseDesign: "moon",
      });
    }
  }, [address, generate]);

  const handleRegenerate = async () => {
    if (!address) return;

    const newSeed = `day13-${address}-${Date.now()}`;
    setSeed(newSeed);
    await generate({
      seed: newSeed,
      complexity: 6,
      variation: "dramatic",
      baseDesign: "moon",
    });
  };

  const handleRecordAnimation = async () => {
    if (!ascii?.art) return;

    try {
      // Get canvas element for recording
      const canvas = document.querySelector(
        "canvas"
      ) as HTMLCanvasElement | null;
      await recorder.startRecording(canvas);
      // Let it record for 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await recorder.stopRecording();
    } catch (error) {
      console.error("Recording failed:", error);
    }
  };

  const handleMint = async () => {
    if (!ascii?.art || !address) return;

    setIsMinting(true);
    setMintError(null);

    try {
      // Step 1: Record animation if not already recorded
      let recordUrl = recorder.recordUrl;
      if (!recordUrl) {
        await handleRecordAnimation();
        recordUrl = recorder.recordUrl;
      }

      // Step 2: Upload recording to IPFS
      let animationUrl = "";
      if (recordUrl) {
        // Convert data URL to File for upload
        const response = await fetch(recordUrl);
        const blob = await response.blob();
        const file = new File([blob], `day13-${address}-${Date.now()}.webm`, {
          type: "video/webm",
        });

        await upload.uploadFile(file, animationState);
        animationUrl = upload.uploadUrl || "";
      }

      // Step 3: Prepare metadata
      const metadata = {
        name: `Day 13 ASCII Art - ${seed}`,
        description: "Unique ASCII art generated for Day 13 free mint",
        image: `data:text/plain;charset=utf-8,${encodeURIComponent(ascii.art)}`,
        animation_url: animationUrl,
        animation_settings: {
          mode: animationState.mode,
          palette: animationState.palette,
          speed: animationState.speed,
          amplitude: animationState.amplitude,
          gradient: animationState.gradient,
          targetChar: animationState.targetChar,
          targetSet: animationState.targetSet,
        },
        attributes: [
          { trait_type: "Day", value: "13" },
          { trait_type: "Mechanic", value: "Free Mint" },
          { trait_type: "Base Design", value: "moon" },
          { trait_type: "Variation", value: "dramatic" },
          { trait_type: "Complexity", value: "6" },
        ],
      };

      // Step 4: Call smart contract mint function
      // This would be replaced with actual contract call
      console.log("Minting with metadata:", metadata);

      // Simulate mint success
      setTimeout(() => {
        const tokenId = `10013-${address}-${Date.now()}`;
        setHasMinted(true);
        setIsMinting(false);
        onMintComplete?.(tokenId, metadata);
      }, 2000);
    } catch (error) {
      console.error("Mint failed:", error);
      setMintError(error instanceof Error ? error.message : "Mint failed");
      setIsMinting(false);
    }
  };

  if (!address) {
    return (
      <div
        className={`p-8 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}
      >
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Connect Wallet
        </h3>
        <p className="text-yellow-700">
          Please connect your wallet to access Day 13 free mint.
        </p>
      </div>
    );
  }

  if (hasMinted) {
    return (
      <div
        className={`p-8 bg-green-50 border border-green-200 rounded-lg ${className}`}
      >
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          🎉 Successfully Minted!
        </h3>
        <p className="text-green-700">
          Your Day 13 ASCII art has been minted and is now part of your
          collection.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🌙 Day 13: Free ASCII Art Mint
        </h2>
        <p className="text-gray-600">
          Generate unique ASCII art and record your custom animation
        </p>
      </div>

      {/* ASCII Generation */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Your Unique ASCII Art
          </h3>
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            🎲 Regenerate
          </button>
        </div>

        {isGenerating && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-gray-600">Generating your ASCII art...</p>
          </div>
        )}

        {generateError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{generateError}</p>
          </div>
        )}

        {ascii?.art && (
          <div className="space-y-4">
            <div className="bg-black text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{ascii.art}</pre>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-gray-500">Base Design</div>
                <div className="font-medium capitalize">
                  {ascii.metadata.baseDesign}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-gray-500">Complexity</div>
                <div className="font-medium">
                  {ascii.metadata.complexity}/10
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-gray-500">Variation</div>
                <div className="font-medium capitalize">
                  {ascii.metadata.variation}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-gray-500">Changes</div>
                <div className="font-medium">{ascii.metadata.changes}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animation Controls */}
      {ascii?.art && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Customize Your Animation
          </h3>

          {/* Animation Preview */}
          <div className="mb-6">
            <ASCIIAnimator
              src={`data:text/plain;charset=utf-8,${encodeURIComponent(
                ascii.art
              )}`}
              pantId="day-13"
            />
          </div>

          {/* Recording Controls */}
          <div className="flex gap-4">
            <button
              onClick={handleRecordAnimation}
              disabled={recorder.isRecording}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {recorder.isRecording
                ? "⏹️ Stop Recording"
                : "🎬 Record Animation"}
            </button>

            {recorder.recordUrl && (
              <div className="flex items-center gap-2 text-green-600">
                <span>✅ Recording ready</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mint Button */}
      {ascii?.art && (
        <div className="text-center">
          <button
            onClick={handleMint}
            disabled={isMinting || isGenerating}
            className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
          >
            {isMinting ? "⏳ Minting..." : "🌙 Mint Your ASCII Art (FREE)"}
          </button>

          {mintError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">{mintError}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
