import { useState, useCallback, useEffect } from 'react';

interface EmojiSubstitutionParams {
  text: string;
  complexity?: number; // 1-10 scale, default to 5
  theme?: 'lunar' | 'nature' | 'abstract' | 'random';
  enabled?: boolean;
}

interface EmojiSubstitutionResult {
  substitutedText: string;
  isSubstituted: boolean;
  complexity: number;
  theme: 'lunar' | 'nature' | 'abstract' | 'random';
  toggleSubstitution: () => void;
  setComplexity: (complexity: number) => void;
  setTheme: (theme: 'lunar' | 'nature' | 'abstract' | 'random') => void;
  resetToOriginal: () => void;
}

// Emoji mappings for different themes
const EMOJI_THEMES = {
  lunar: {
    'o': ['🌕', '🌝', '🌙', '◯', '●'],
    'O': ['🌕', '🌝', '🌞', '◉', '⭕'],
    '0': ['🌑', '🌚', '🌘', '🌗', '🌖'],
    '(': ['🌙', '☽', '◔', '◕'],
    ')': ['☾', '🌛', '◕', '◔'],
    '{': ['🌜', '☽', '◧', '◨'],
    '}': ['🌛', '☾', '◨', '◧'],
    '[': ['🌙', '☽', '◀', '◁'],
    ']': ['☾', '🌛', '▶', '▷'],
    '|': ['🌙', '☾', '│', '┃'],
    '/': ['🌙', '☾', '╱', '╲'],
    '\\': ['🌙', '☾', '╲', '╱'],
    '~': ['🌊', '🌙', '∼', '≈'],
    '-': ['🌙', '☾', '─', '━']
  },
  nature: {
    'o': ['🌱', '🌿', '🍃', '🌺', '🌻'],
    'O': ['🌳', '🌲', '🌴', '🌵', '🪴'],
    '0': ['🌱', '🌿', '🍃', '🍄', '☘️'],
    '(': ['🌸', '🌷', '🌼', '💐', '💮'],
    ')': ['🌸', '🌷', '🌼', '💐', '💮'],
    '{': ['🎋', '🎍', '🍃', '🌿'],
    '}': ['🎋', '🎍', '🍃', '🌿'],
    '[': ['🪨', '🍃', '🌿', '🌱'],
    ']': ['🪨', '🍃', '🌿', '🌱'],
    '|': ['🪵', '🌿', '│', '┃'],
    '/': ['🍃', '🌿', '╱', '╲'],
    '\\': ['🍃', '🌿', '╲', '╱'],
    '~': ['🌊', '💧', '💦', '粼'],
    '-': ['🌿', '🍃', '🪨', '━']
  },
  abstract: {
    'o': ['🔴', '🔵', '🟢', '🟡', '🟣'],
    'O': ['🔘', '⭕', '⚪', '🔴', '🔵'],
    '0': ['🔴', '🔵', '🟢', '🟡', '🟣'],
    '(': ['🔺', '🔹', '🔸', '🔶', '🔷'],
    ')': ['🔺', '🔹', '🔸', '🔶', '🔷'],
    '{': ['◀️', '▶️', '🔼', '🔽'],
    '}': ['◀️', '▶️', '🔼', '🔽'],
    '[': ['🟥', '🟦', '🟩', '🟨'],
    ']': ['🟥', '🟦', '🟩', '🟨'],
    '|': ['⏸️', '🮂', '🮃', '│'],
    '/': [' slash ', ' slash2 ', ' / ', ' ╱ '],
    '\\': [' backslash ', ' \\ ', ' ╲ '],
    '~': ['〰️', '〰', ' ~ ', ' ≈ '],
    '-': ['➖', '—', '–', '─']
  },
  random: {
    'o': ['🌕', '🌝', '🌙', '🌱', '🌸', '🔴', '🔵', '🟢', '🟡', '🟣'],
    'O': ['🌕', '🌝', '🌞', '🌳', '🌲', '🔘', '⭕', '⚪', '🔴', '🔵'],
    '0': ['🌑', '🌚', '🌘', '🌱', '🌿', '🔴', '🔵', '🟢', '🟡', '🟣'],
    '(': ['🌙', '☽', '🌱', '🌸', '🌷', '🔺', '🔹', '🔸', '🔶', '🔷'],
    ')': ['☾', '🌛', '🌿', '🍃', '🌺', '🔺', '🔹', '🔸', '🔶', '🔷'],
    '{': ['🌜', '☽', '🎋', '🌿', '◀️', '▶️', '🔼', '🔽'],
    '}': ['🌛', '☾', '🎍', '🍃', '◀️', '▶️', '🔼', '🔽'],
    '[': ['🌙', '☽', '🪨', '🌱', '🟥', '🟦', '🟩', '🟨'],
    ']': ['☾', '🌛', '🪨', '🌿', '🟥', '🟦', '🟩', '🟨'],
    '|': ['🌙', '☾', '🪵', '🌿', '⏸️', '🮂', '🮃', '│'],
    '/': ['🌙', '☾', '🍃', '🌿', ' slash ', ' slash2 ', ' / ', ' ╱ '],
    '\\': ['🌙', '☾', '🍃', '🌿', ' backslash ', ' \\ ', ' ╲ '],
    '~': ['🌊', '💧', '🌙', '🌱', '〰️', '〰', ' ~ ', ' ≈ '],
    '-': ['🌙', '☾', '🌿', '🍃', '➖', '—', '–', '─']
  }
};

/**
 * Generates a seeded random number based on string input
 */
const seededRandom = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash) / 2147483648; // Normalize to [0,1]
};

export const useEmojiSubstitution = (initialText: string): EmojiSubstitutionResult => {
  const [enabled, setEnabled] = useState(false);
  const [complexity, setComplexity] = useState(5);
  const [theme, setTheme] = useState<'lunar' | 'nature' | 'abstract' | 'random'>('lunar');
  const [substitutedText, setSubstitutedText] = useState(initialText);

  const applyEmojiSubstitution = useCallback((text: string, complexityValue: number, themeKey: string): string => {
    const emojiMap = EMOJI_THEMES[themeKey as keyof typeof EMOJI_THEMES] || EMOJI_THEMES.lunar;
    const lines = text.split('\n');
    const substitutionRate = Math.min(0.3 + (complexityValue * 0.07), 0.8);

    const resultLines = lines.map(line => {
      const chars = line.split('');
      const positions: { index: number; char: string }[] = [];

      chars.forEach((char, index) => {
        if (emojiMap[char as keyof typeof emojiMap]) {
          positions.push({ index, char });
        }
      });

      const shuffledPositions = [...positions].sort((a, b) => seededRandom(`${text}-${a.index}`) - seededRandom(`${text}-${b.index}`));
      const charsToReplace = Math.ceil(positions.length * substitutionRate);

      shuffledPositions.slice(0, charsToReplace).forEach(({ index, char }) => {
        const emojiOptions = emojiMap[char as keyof typeof emojiMap];
        const randomIndex = Math.floor(seededRandom(`${text}-${index}-${complexityValue}-${themeKey}`) * emojiOptions.length);
        chars[index] = emojiOptions[randomIndex];
      });

      return chars.join('');
    });

    return resultLines.join('\n');
  }, []);

  const toggleSubstitution = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);

  const resetToOriginal = useCallback(() => {
    setEnabled(false);
  }, []);

  const setComplexityCallback = useCallback((newComplexity: number) => {
    setComplexity(newComplexity);
  }, []);

  const setThemeCallback = useCallback((newTheme: 'lunar' | 'nature' | 'abstract' | 'random') => {
    setTheme(newTheme);
  }, []);

  useEffect(() => {
    if (enabled) {
      const newText = applyEmojiSubstitution(initialText, complexity, theme);
      setSubstitutedText(newText);
    } else {
      setSubstitutedText(initialText);
    }
  }, [initialText, enabled, complexity, theme, applyEmojiSubstitution]);

  return {
    substitutedText,
    isSubstituted: enabled,
    complexity,
    theme,
    toggleSubstitution,
    setComplexity: setComplexityCallback,
    setTheme: setThemeCallback,
    resetToOriginal
  };
};