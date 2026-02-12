import type { SampleWish } from './sampleWishes';

interface EmojiSet {
  title: string[];
  body: string[];
  decoration: string[];
}

const EMOJI_MAP: Record<string, EmojiSet> = {
  friend: {
    title: ['🎉', '✨', '🎂'],
    body: ['🤝', '💫', '🎈'],
    decoration: ['✨', '🎊', '🌟'],
  },
  'best friend': {
    title: ['🎂', '✨', '💖'],
    body: ['💫', '🎉', '🌟'],
    decoration: ['✨', '💝', '🎊'],
  },
  mom: {
    title: ['💖', '🌸', '✨'],
    body: ['👩‍👧', '💝', '🌺'],
    decoration: ['🌸', '💕', '✨'],
  },
  girlfriend: {
    title: ['❤️', '🌹', '💫'],
    body: ['💖', '✨', '💕'],
    decoration: ['🌹', '💝', '✨'],
  },
  boyfriend: {
    title: ['❤️', '🌹', '💫'],
    body: ['💖', '✨', '💕'],
    decoration: ['🌹', '💝', '✨'],
  },
  brother: {
    title: ['🎉', '😂', '🎈'],
    body: ['🎁', '🎊', '✨'],
    decoration: ['🎈', '🎉', '🌟'],
  },
  teacher: {
    title: ['🎂', '📚', '✨'],
    body: ['🌟', '💫', '🎓'],
    decoration: ['✨', '📖', '🌟'],
  },
  default: {
    title: ['🎂', '🎉', '✨'],
    body: ['💫', '🎈', '🌟'],
    decoration: ['✨', '🎊', '💝'],
  },
};

const TONE_EMOJI_MAP: Record<string, string[]> = {
  funny: ['😂', '🎈', '🎁', '🤣'],
  romantic: ['❤️', '🌹', '💫', '💖'],
  emotional: ['💖', '✨', '💫', '🌟'],
  formal: ['🎂', '🌟', '✨', '📚'],
  'short & sweet': ['🎉', '💝', '✨', '🎂'],
  'light roast': ['😂', '🎈', '🎁', '🎉'],
};

/**
 * Get emoji set based on relationship and tone
 */
function getEmojiSet(wish: SampleWish): EmojiSet {
  const relationshipKey = wish.relationship.toLowerCase();
  return EMOJI_MAP[relationshipKey] || EMOJI_MAP.default;
}

/**
 * Select emoji for title based on relationship and variation
 */
export function getTitleEmoji(wish: SampleWish, variationIndex: number = 0): string {
  const emojiSet = getEmojiSet(wish);
  return emojiSet.title[variationIndex % emojiSet.title.length];
}

/**
 * Select emoji for body based on tone and variation
 */
export function getBodyEmoji(wish: SampleWish, variationIndex: number = 0): string {
  const toneEmojis = TONE_EMOJI_MAP[wish.tone.toLowerCase()] || TONE_EMOJI_MAP['emotional'];
  return toneEmojis[variationIndex % toneEmojis.length];
}

/**
 * Get decoration emojis for floating effects
 */
export function getDecorationEmojis(wish: SampleWish, variationIndex: number = 0): string[] {
  const emojiSet = getEmojiSet(wish);
  const count = 2 + (variationIndex % 2); // 2-3 emojis
  return emojiSet.decoration.slice(0, count);
}

/**
 * Enhance title with emoji (placement varies by variation)
 */
export function enhanceTitle(title: string, wish: SampleWish, variationIndex: number = 0): string {
  const emoji = getTitleEmoji(wish, variationIndex);
  
  // Variation 0: emoji at end
  // Variation 1: emoji at start
  // Variation 2: emoji at both ends
  switch (variationIndex % 3) {
    case 0:
      return `${title} ${emoji}`;
    case 1:
      return `${emoji} ${title}`;
    case 2:
      return `${emoji} ${title} ${emoji}`;
    default:
      return `${title} ${emoji}`;
  }
}

/**
 * Enhance body with emoji (subtle, max 1 emoji)
 */
export function enhanceBody(body: string, wish: SampleWish, variationIndex: number = 0): string {
  const emoji = getBodyEmoji(wish, variationIndex);
  
  // Only add emoji to body on variation 1 and 2, at the end
  if (variationIndex % 3 === 0) {
    return body; // No body emoji for variation 0
  }
  
  return `${body} ${emoji}`;
}
