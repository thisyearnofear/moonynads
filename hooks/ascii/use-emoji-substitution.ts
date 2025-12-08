import { useState, useCallback, useEffect } from 'react';
import {
  substituteEmojis,
  getAvailableThemes,
  getThemeDescription,
  EmojiTheme,
  type GeneratedEmoji,
} from '@/lib/emoji-generator';

export interface EmojiSubstitutionResult {
  substitutedText: string;
  isSubstituted: boolean;
  complexity: number;
  theme: EmojiTheme;
  metadata: GeneratedEmoji['metadata'] | null;
  toggleSubstitution: () => void;
  setComplexity: (complexity: number) => void;
  setTheme: (theme: EmojiTheme) => void;
  resetToOriginal: () => void;
  getThemeDescription: (theme: EmojiTheme) => string;
  getAvailableThemes: () => EmojiTheme[];
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
  const [substitutedText, setSubstitutedText] = useState(initialText);
  const [metadata, setMetadata] = useState<GeneratedEmoji['metadata'] | null>(
    null
  );

  // Apply emoji substitution whenever text, complexity, or theme changes
  useEffect(() => {
    try {
      const result = substituteEmojis({
        text: initialText,
        complexity,
        theme,
      });
      setSubstitutedText(result.art);
      setMetadata(result.metadata);
    } catch (error) {
      console.error('Emoji substitution error:', error);
      setSubstitutedText(initialText);
      setMetadata(null);
    }
  }, [initialText, complexity, theme]);

  const setComplexityCallback = useCallback((newComplexity: number) => {
    const clamped = Math.max(1, Math.min(10, newComplexity));
    setComplexity(clamped);
  }, []);

  const setThemeCallback = useCallback((newTheme: EmojiTheme) => {
    setTheme(newTheme);
  }, []);

  return {
    substitutedText,
    isSubstituted: true, // Always substituted since it's always displayed
    complexity,
    theme,
    metadata,
    toggleSubstitution: () => {}, // No-op, kept for API compatibility
    setComplexity: setComplexityCallback,
    setTheme: setThemeCallback,
    resetToOriginal: () => {}, // No-op, kept for API compatibility
    getThemeDescription,
    getAvailableThemes,
  };
};