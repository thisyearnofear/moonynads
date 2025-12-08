/**
 * Emoji Generator - Business Logic Layer
 * 
 * Generates lunar-themed emoji substitutions for ASCII art.
 * Follows the same architecture as ascii-generator.ts
 */

export type EmojiTheme = 'lunar' | 'phases' | 'crescent' | 'full';

export interface EmojiSubstitutionParams {
  text: string;
  complexity: number; // 1-10 scale
  theme: EmojiTheme;
}

export interface GeneratedEmoji {
  art: string;
  metadata: {
    theme: EmojiTheme;
    complexity: number;
    substitutionRate: number;
    charactersSubstituted: number;
    totalCharactersEligible: number;
    themeIntegrity: number; // percentage of characters that are moon-themed
  };
}

/**
 * Lunar-exclusive emoji mappings
 * Each character maps to 2-3 authentic moon emojis
 */
const EMOJI_THEMES: Record<EmojiTheme, Record<string, string[]>> = {
  lunar: {
    // Full moon and crescent variations
    'o': ['🌕', '🌝', '🌙'],
    'O': ['🌕', '🌝', '🌙'],
    '0': ['🌕', '🌝', '🌙'],
    // Curved brackets map to crescent moons
    '(': ['🌙', '☽', '🌛'],
    ')': ['🌙', '☾', '🌜'],
    '{': ['🌙', '☽', '🌛'],
    '}': ['🌙', '☾', '🌜'],
    '[': ['🌙', '☽', '🌛'],
    ']': ['🌙', '☾', '🌜'],
    // Vertical and diagonal lines
    '|': ['🌕', '🌙', '☽'],
    '/': ['🌙', '☽', '🌛'],
    '\\': ['🌙', '☾', '🌜'],
    '~': ['🌙', '🌕', '☽'],
    '-': ['🌙', '🌕', '☽'],
  },
  phases: {
    // All phase progressions
    'o': ['🌕', '🌖', '🌗'],
    'O': ['🌕', '🌖', '🌗'],
    '0': ['🌕', '🌖', '🌗'],
    '(': ['🌙', '🌛', '☽'],
    ')': ['🌙', '🌜', '☾'],
    '{': ['🌙', '🌛', '☽'],
    '}': ['🌙', '🌜', '☾'],
    '[': ['🌙', '🌛', '☽'],
    ']': ['🌙', '🌜', '☾'],
    '|': ['🌕', '🌖', '🌗'],
    '/': ['🌙', '🌛', '☽'],
    '\\': ['🌙', '🌜', '☾'],
    '~': ['🌕', '🌖', '🌗'],
    '-': ['🌕', '🌖', '🌗'],
  },
  crescent: {
    // Crescent and new moon focus
    'o': ['🌙', '☽', '☾'],
    'O': ['🌙', '☽', '☾'],
    '0': ['🌙', '☽', '☾'],
    '(': ['🌙', '☽', '🌛'],
    ')': ['🌙', '☾', '🌜'],
    '{': ['☽', '🌙', '🌛'],
    '}': ['☾', '🌙', '🌜'],
    '[': ['☽', '🌙', '🌛'],
    ']': ['☾', '🌙', '🌜'],
    '|': ['🌙', '☽', '☾'],
    '/': ['☽', '🌙', '🌛'],
    '\\': ['☾', '🌙', '🌜'],
    '~': ['🌙', '☽', '☾'],
    '-': ['🌙', '☽', '☾'],
  },
  full: {
    // Full moon and waxing gibbous
    'o': ['🌕', '🌝', '🌖'],
    'O': ['🌕', '🌝', '🌖'],
    '0': ['🌕', '🌝', '🌖'],
    '(': ['🌕', '🌝', '🌖'],
    ')': ['🌕', '🌝', '🌖'],
    '{': ['🌕', '🌝', '🌖'],
    '}': ['🌕', '🌝', '🌖'],
    '[': ['🌕', '🌝', '🌖'],
    ']': ['🌕', '🌝', '🌖'],
    '|': ['🌕', '🌝', '🌖'],
    '/': ['🌕', '🌝', '🌖'],
    '\\': ['🌕', '🌝', '🌖'],
    '~': ['🌕', '🌝', '🌖'],
    '-': ['🌕', '🌝', '🌖'],
  },
};

/**
 * All valid moon emoji characters for integrity checking
 */
const MOON_EMOJIS = new Set([
  '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔',
  '🌝', '🌚', '🌙', '🌛', '🌜', '☽', '☾'
]);

/**
 * Generates a seeded random number based on string input
 * Ensures deterministic results for same inputs
 */
function seededRandom(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash) / 2147483648; // Normalize to [0,1]
}

/**
 * Validates theme parameter
 */
function isValidTheme(theme: string): theme is EmojiTheme {
  return theme in EMOJI_THEMES;
}

/**
 * Get available themes
 */
export function getAvailableThemes(): EmojiTheme[] {
  return Object.keys(EMOJI_THEMES) as EmojiTheme[];
}

/**
 * Get theme description for UI
 */
export function getThemeDescription(theme: EmojiTheme): string {
  const descriptions: Record<EmojiTheme, string> = {
    lunar: 'Full moon and crescent mix',
    phases: 'Moon phase progression',
    crescent: 'Crescent-focused aesthetic',
    full: 'Pure full moon dominance',
  };
  return descriptions[theme];
}

/**
 * Main substitution algorithm
 * Applies lunar emoji substitutions to ASCII art with deterministic behavior
 */
export function substituteEmojis(
  params: EmojiSubstitutionParams
): GeneratedEmoji {
  if (!isValidTheme(params.theme)) {
    throw new Error(`Invalid theme: ${params.theme}. Valid themes: ${getAvailableThemes().join(', ')}`);
  }

  if (params.complexity < 1 || params.complexity > 10) {
    throw new Error('Complexity must be between 1 and 10');
  }

  const emojiMap = EMOJI_THEMES[params.theme];
  const lines = params.text.split('\n');
  
  // Calculate substitution rate: lower complexity = less substitution, max ~98% at 10
  const substitutionRate = Math.min(0.15 + (params.complexity * 0.085), 0.98);

  let totalEligibleChars = 0;
  let totalSubstitutedChars = 0;

  const resultLines = lines.map((line, lineIndex) => {
    const chars = line.split('');
    const positions: { index: number; char: string }[] = [];

    // Find all characters that can be substituted
    chars.forEach((char, index) => {
      if (emojiMap[char as keyof typeof emojiMap]) {
        positions.push({ index, char });
        totalEligibleChars++;
      }
    });

    if (positions.length === 0) return line;

    // Deterministically select which positions to replace
    const charsToReplace = Math.ceil(positions.length * substitutionRate);
    const selectedIndices = new Set<number>();

    // Use seeded randomness for consistent, distributed selection
    for (let i = 0; i < charsToReplace && i < positions.length; i++) {
      const seed = seededRandom(
        `${params.theme}-${lineIndex}-${params.complexity}-${i}-${params.text.length}`
      );
      const posIndex = Math.floor(seed * positions.length);
      if (!selectedIndices.has(posIndex)) {
        selectedIndices.add(posIndex);
      }
    }

    // Apply substitutions
    selectedIndices.forEach((posIndex) => {
      const { index, char } = positions[posIndex];
      const emojiOptions = emojiMap[char as keyof typeof emojiMap];
      
      // Deterministically select emoji variant
      const variantSeed = seededRandom(
        `${char}-${index}-${lineIndex}-${params.complexity}`
      );
      const randomIndex = Math.floor(variantSeed * emojiOptions.length);
      chars[index] = emojiOptions[randomIndex];
      totalSubstitutedChars++;
    });

    return chars.join('');
  });

  // Calculate theme integrity (percentage of output that is moon-themed)
  const resultText = resultLines.join('\n');
  let moonEmojiCount = 0;
  for (const char of resultText) {
    if (MOON_EMOJIS.has(char)) {
      moonEmojiCount++;
    }
  }
  const themeIntegrity = totalSubstitutedChars > 0 
    ? (moonEmojiCount / totalSubstitutedChars) * 100
    : 100; // Empty or no substitutions = perfect integrity

  return {
    art: resultLines.join('\n'),
    metadata: {
      theme: params.theme,
      complexity: params.complexity,
      substitutionRate: parseFloat(substitutionRate.toFixed(2)),
      charactersSubstituted: totalSubstitutedChars,
      totalCharactersEligible: totalEligibleChars,
      themeIntegrity: Math.round(themeIntegrity),
    },
  };
}

/**
 * Get emoji options for a specific character in a theme
 * Useful for testing and documentation
 */
export function getEmojiOptions(
  char: string,
  theme: EmojiTheme
): string[] {
  if (!isValidTheme(theme)) {
    throw new Error(`Invalid theme: ${theme}`);
  }
  return EMOJI_THEMES[theme][char] || [];
}

/**
 * Get all supported characters for a theme
 */
export function getSupportedCharacters(theme: EmojiTheme): string[] {
  if (!isValidTheme(theme)) {
    throw new Error(`Invalid theme: ${theme}`);
  }
  return Object.keys(EMOJI_THEMES[theme]);
}
