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
 * Deterministic seeded hash for consistent selection
 */
function hashPosition(text: string, lineIndex: number, charIndex: number, complexity: number): number {
  const input = `${text}-line${lineIndex}-char${charIndex}-complex${complexity}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Main substitution algorithm - follows ascii-generator pattern
 * Makes deterministic character transformations based on complexity
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
  
  // Complexity determines selection probability (1=20%, 10=95%)
  const selectionProbability = 0.2 + (params.complexity * 0.075);

  let totalEligibleChars = 0;
  let totalSubstitutedChars = 0;

  const resultLines = lines.map((line, lineIndex) => {
    const chars = line.split('');

    chars.forEach((char, charIndex) => {
      // Only consider characters in our emoji map
      const emojiOptions = emojiMap[char as keyof typeof emojiMap];
      if (!emojiOptions) return;

      totalEligibleChars++;

      // Use deterministic seeding to decide whether to transform this character
      const posHash = hashPosition(params.text, lineIndex, charIndex, params.complexity);
      const selectValue = (posHash % 100) / 100; // Normalize to 0-1

      if (selectValue < selectionProbability) {
        // Transform this character
        const variantIndex = Math.floor((posHash / 100) % emojiOptions.length);
        chars[charIndex] = emojiOptions[variantIndex];
        totalSubstitutedChars++;
      }
    });

    return chars.join('');
  });

  // Calculate theme integrity (percentage of substituted chars that are moon-themed)
  const resultText = resultLines.join('\n');
  let moonEmojiCount = 0;
  for (const char of resultText) {
    if (MOON_EMOJIS.has(char)) {
      moonEmojiCount++;
    }
  }
  const themeIntegrity = totalSubstitutedChars > 0 
    ? (moonEmojiCount / totalSubstitutedChars) * 100
    : 100;

  const actualSubstitutionRate = totalEligibleChars > 0
    ? totalSubstitutedChars / totalEligibleChars
    : 0;

  return {
    art: resultLines.join('\n'),
    metadata: {
      theme: params.theme,
      complexity: params.complexity,
      substitutionRate: parseFloat((actualSubstitutionRate * 100).toFixed(1)),
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
