import { useState, useCallback, useEffect } from 'react';
import {
  substituteEmojis,
  getAvailableThemes,
  getAvailableVariations,
  getThemeDescription,
  getVariationDescription,
  EmojiTheme,
  EmojiVariation,
  type GeneratedEmoji,
} from '@/lib/emoji-generator';

export interface EmojiSubstitutionResult {
  substitutedText: string;
  isSubstituted: boolean;
  complexity: number;
  theme: EmojiTheme;
  variation: EmojiVariation;
  seed: string;
  metadata: GeneratedEmoji['metadata'] | null;
  toggleSubstitution: () => void;
  setComplexity: (complexity: number) => void;
  setTheme: (theme: EmojiTheme) => void;
  setVariation: (variation: EmojiVariation) => void;
  setSeed: (seed: string) => void;
  randomizeSeed: () => void;
  resetToOriginal: () => void;
  getThemeDescription: (theme: EmojiTheme) => string;
  getVariationDescription: (variation: EmojiVariation) => string;
  getAvailableThemes: () => EmojiTheme[];
  getAvailableVariations: () => EmojiVariation[];
}

/**
 * React hook for lunar emoji substitution
 * Thin wrapper around lib/emoji-generator business logic
 * Manages state and side effects only
 */
export const useEmojiSubstitution = (
  initialText: string
): EmojiSubstitutionResult => {
  const [complexity, setComplexity] = useState(5);
  const [theme, setTheme] = useState<EmojiTheme>('lunar');
  const [variation, setVariation] = useState<EmojiVariation>('moderate');
  const [seed, setSeed] = useState(`preview-${Date.now()}`);
  const [substitutedText, setSubstitutedText] = useState(initialText);
  const [metadata, setMetadata] = useState<GeneratedEmoji['metadata'] | null>(
    null
  );

  // Apply emoji substitution whenever text, complexity, theme, variation, or seed changes
  useEffect(() => {
    try {
      const result = substituteEmojis({
        text: initialText,
        complexity,
        theme,
        variation,
        seed,
      });
      setSubstitutedText(result.art);
      setMetadata(result.metadata);
    } catch (error) {
      console.error('Emoji substitution error:', error);
      setSubstitutedText(initialText);
      setMetadata(null);
    }
  }, [initialText, complexity, theme, variation, seed]);

  const setComplexityCallback = useCallback((newComplexity: number) => {
    const clamped = Math.max(1, Math.min(10, newComplexity));
    setComplexity(clamped);
  }, []);

  const setThemeCallback = useCallback((newTheme: EmojiTheme) => {
    setTheme(newTheme);
  }, []);

  const setVariationCallback = useCallback((newVariation: EmojiVariation) => {
    setVariation(newVariation);
  }, []);

  const setSeedCallback = useCallback((newSeed: string) => {
    setSeed(newSeed);
  }, []);

  const randomizeSeedCallback = useCallback(() => {
    setSeed(
      `variation-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    );
  }, []);

  const resetToOriginal = useCallback(() => {
    setComplexity(5);
    setTheme('lunar');
    setVariation('moderate');
    setSeed(`preview-${Date.now()}`);
  }, []);

  return {
    substitutedText,
    isSubstituted: true, // Always substituted since it's always displayed
    complexity,
    theme,
    variation,
    seed,
    metadata,
    toggleSubstitution: () => {}, // No-op, kept for API compatibility
    setComplexity: setComplexityCallback,
    setTheme: setThemeCallback,
    setVariation: setVariationCallback,
    setSeed: setSeedCallback,
    randomizeSeed: randomizeSeedCallback,
    resetToOriginal,
    getThemeDescription,
    getVariationDescription,
    getAvailableThemes,
    getAvailableVariations,
  };
};