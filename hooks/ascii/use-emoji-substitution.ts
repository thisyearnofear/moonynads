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
  const [enabled, setEnabled] = useState(false);
  const [complexity, setComplexity] = useState(5);
  const [theme, setTheme] = useState<EmojiTheme>('lunar');
  const [substitutedText, setSubstitutedText] = useState(initialText);
  const [metadata, setMetadata] = useState<GeneratedEmoji['metadata'] | null>(
    null
  );

  // Apply emoji substitution whenever text, complexity, or theme changes
  useEffect(() => {
    if (enabled) {
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
    } else {
      setSubstitutedText(initialText);
      setMetadata(null);
    }
  }, [initialText, enabled, complexity, theme]);

  const toggleSubstitution = useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  const resetToOriginal = useCallback(() => {
    setEnabled(false);
    setComplexity(5);
    setTheme('lunar');
  }, []);

  const setComplexityCallback = useCallback((newComplexity: number) => {
    const clamped = Math.max(1, Math.min(10, newComplexity));
    setComplexity(clamped);
  }, []);

  const setThemeCallback = useCallback((newTheme: EmojiTheme) => {
    setTheme(newTheme);
  }, []);

  return {
    substitutedText,
    isSubstituted: enabled,
    complexity,
    theme,
    metadata,
    toggleSubstitution,
    setComplexity: setComplexityCallback,
    setTheme: setThemeCallback,
    resetToOriginal,
    getThemeDescription,
    getAvailableThemes,
  };
};