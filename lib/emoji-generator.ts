/**
 * Emoji Generator - Business Logic Layer
 * 
 * Generates lunar-themed emoji substitutions for ASCII art.
 * Follows the same architecture as ascii-generator.ts
 */

export type EmojiTheme = 'lunar' | 'phases' | 'crescent' | 'full';
export type EmojiVariation = 'subtle' | 'moderate' | 'dramatic';

export interface EmojiSubstitutionParams {
  text: string;
  seed?: string; // For reproducible results
  complexity: number; // 1-10 scale
  theme: EmojiTheme;
  variation?: EmojiVariation; // Controls transformation strategy
}

export interface GeneratedEmoji {
  art: string;
  metadata: {
    seed: string;
    theme: EmojiTheme;
    variation: EmojiVariation;
    complexity: number;
    substitutionRate: number;
    charactersSubstituted: number;
    totalCharactersEligible: number;
    transformationStrategies: string[]; // Which strategies were used
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
 * Structural characters that should rarely be transformed
 * These maintain the shape and alignment of the ASCII art
 */
const PROTECTED_CHARS = new Set(['|', '/', '\\', '_', '-', '=']);

/**
 * Character that frequently appear in boundaries and should be protected
 */
const STRUCTURAL_CHARS = new Set(['(', ')', '{', '}', '[', ']']);

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
 * Get available variation types
 */
export function getAvailableVariations(): EmojiVariation[] {
  return ['subtle', 'moderate', 'dramatic'];
}

/**
 * Get variation description for UI
 */
export function getVariationDescription(variation: EmojiVariation): string {
  const descriptions: Record<EmojiVariation, string> = {
    subtle: 'Minimal changes, preserves structure (15-55%)',
    moderate: 'Balanced emoji integration (25-90%)',
    dramatic: 'Aggressive transformation (40-95%)',
  };
  return descriptions[variation];
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
 * Makes deterministic character transformations based on complexity and variation
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

  // Generate consistent seed if not provided
  const seed = params.seed || `emoji-${Date.now()}-${Math.random()}`;
  const variation = params.variation || 'moderate';
  const emojiMap = EMOJI_THEMES[params.theme];
  const lines = params.text.split('\n');
  
  // Variation determines selection probability and strategies
  const probabilityByVariation: Record<EmojiVariation, number> = {
    subtle: 0.15 + (params.complexity * 0.04), // 15-55%
    moderate: 0.25 + (params.complexity * 0.065), // 25-90%
    dramatic: 0.4 + (params.complexity * 0.055), // 40-95%
  };
  
  const selectionProbability = Math.min(probabilityByVariation[variation], 0.95);
  const usedStrategies: Set<string> = new Set();

  let totalEligibleChars = 0;
  let totalSubstitutedChars = 0;

  const resultLines = lines.map((line, lineIndex) => {
    const chars = line.split('');

    chars.forEach((char, charIndex) => {
      // Only consider characters in our emoji map
      const emojiOptions = emojiMap[char as keyof typeof emojiMap];
      if (!emojiOptions) return;

      totalEligibleChars++;

      // Determine transformation probability based on character type and variation
      let transformProbability = selectionProbability;
      
      // Protected structural chars have lower transformation chance
      if (PROTECTED_CHARS.has(char)) {
        transformProbability *= variation === 'subtle' ? 0.3 : variation === 'moderate' ? 0.5 : 0.7;
        usedStrategies.add('structural-protection');
      }

      // Use deterministic seeding to decide whether to transform this character
      const posHash = hashPosition(seed, lineIndex, charIndex, params.complexity);
      const selectValue = (posHash % 100) / 100; // Normalize to 0-1

      if (selectValue < transformProbability) {
        // Apply strategy based on variation
        const strategyValue = ((posHash / 100) % 3);
        
        if (variation === 'subtle' || strategyValue < 1) {
          // Strategy 1: Simple emoji substitution
          const variantIndex = Math.floor((posHash / 100) % emojiOptions.length);
          chars[charIndex] = emojiOptions[variantIndex];
          usedStrategies.add('substitution');
        } else if (variation === 'dramatic' && strategyValue < 2.5 && STRUCTURAL_CHARS.has(char)) {
          // Strategy 2: Thematic pairing (for brackets in dramatic mode)
          const variantIndex = Math.floor((posHash / 50) % emojiOptions.length);
          chars[charIndex] = emojiOptions[variantIndex];
          usedStrategies.add('thematic-pairing');
        } else {
          // Default back to substitution
          const variantIndex = Math.floor((posHash / 100) % emojiOptions.length);
          chars[charIndex] = emojiOptions[variantIndex];
          usedStrategies.add('substitution');
        }
        
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
      seed,
      theme: params.theme,
      variation,
      complexity: params.complexity,
      substitutionRate: parseFloat((actualSubstitutionRate * 100).toFixed(1)),
      charactersSubstituted: totalSubstitutedChars,
      totalCharactersEligible: totalEligibleChars,
      transformationStrategies: Array.from(usedStrategies),
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
