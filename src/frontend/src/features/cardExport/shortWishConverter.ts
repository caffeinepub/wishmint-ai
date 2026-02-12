/**
 * Short Wish Converter - transforms long/short inputs into premium 15-20 word card-safe messages
 */

const CELEBRATORY_PHRASES = [
  'May your day be filled with joy and laughter',
  'Wishing you endless happiness and unforgettable memories',
  'May this year bring you success and beautiful moments',
  'Here\'s to another amazing year of adventures',
  'Celebrating you and all the joy you bring',
  'May your dreams come true this year',
  'Wishing you love, laughter, and endless blessings',
];

/**
 * Counts words in a string (handles emojis and special characters)
 */
function countWords(text: string): number {
  // Remove emojis and special characters for accurate word count
  const cleaned = text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Shortens text to target word count while maintaining meaning
 */
function shortenToWordCount(text: string, targetWords: number): string {
  const words = text.trim().split(/\s+/);
  
  if (words.length <= targetWords) {
    return text.trim();
  }
  
  // Take first targetWords and try to end on a complete thought
  let shortened = words.slice(0, targetWords).join(' ');
  
  // Remove trailing punctuation except period
  shortened = shortened.replace(/[,;:]$/, '');
  
  // Add ellipsis if we cut mid-sentence
  if (!shortened.match(/[.!?]$/)) {
    shortened += '...';
  }
  
  return shortened;
}

/**
 * Expands short text with celebratory phrasing if needed
 */
function expandToMinimumWords(text: string, minWords: number): string {
  const currentWords = countWords(text);
  
  if (currentWords >= minWords) {
    return text;
  }
  
  // Pick a random celebratory phrase
  const phrase = CELEBRATORY_PHRASES[Math.floor(Math.random() * CELEBRATORY_PHRASES.length)];
  
  // Combine with original text
  const combined = `${text.trim()} ${phrase}`;
  
  // If still too short, return as is (better than over-engineering)
  return combined;
}

/**
 * Converts any wish text into a premium 15-20 word card message
 */
export function convertToShortWish(wishText: string): string {
  if (!wishText || wishText.trim().length === 0) {
    return CELEBRATORY_PHRASES[0] + ' ✨';
  }
  
  // Remove instruction-like content
  let cleaned = wishText
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 0 && 
             !trimmed.match(/^(Title|Message|Footer|Prompt|Instructions):/i);
    })
    .join(' ');
  
  // Remove placeholders
  cleaned = cleaned.replace(/\{[^}]+\}/g, '');
  
  // Clean up extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  const wordCount = countWords(cleaned);
  
  // Target: 15-20 words
  const MIN_WORDS = 15;
  const MAX_WORDS = 20;
  
  let result: string;
  
  if (wordCount > MAX_WORDS) {
    // Shorten to 20 words
    result = shortenToWordCount(cleaned, MAX_WORDS);
  } else if (wordCount < MIN_WORDS) {
    // Expand to at least 15 words
    result = expandToMinimumWords(cleaned, MIN_WORDS);
    // If expansion made it too long, trim back
    if (countWords(result) > MAX_WORDS) {
      result = shortenToWordCount(result, MAX_WORDS);
    }
  } else {
    // Already in range
    result = cleaned;
  }
  
  // Add sparkle emoji if not present and there's room
  if (!result.includes('✨') && !result.includes('🎉') && !result.includes('🎂')) {
    result += ' ✨';
  }
  
  return result;
}

/**
 * Validates that the converted wish is card-safe
 */
export function isCardSafeWish(wish: string): boolean {
  const wordCount = countWords(wish);
  const hasPlaceholders = /\{[^}]+\}/.test(wish);
  const hasInstructions = /^(Title|Message|Footer|Prompt|Instructions):/im.test(wish);
  
  return wordCount >= 1 && wordCount <= 25 && !hasPlaceholders && !hasInstructions;
}
