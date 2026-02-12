import type { SampleWish } from './sampleWishes';

export interface StyleTag {
  label: string;
  gradient: string;
}

const STYLE_TAG_MAP: Record<string, StyleTag> = {
  Cute: {
    label: 'Cute',
    gradient: 'bg-gradient-to-r from-pink-500 to-purple-500',
  },
  Luxury: {
    label: 'Luxury',
    gradient: 'bg-gradient-to-r from-amber-500 to-yellow-600',
  },
  Emotional: {
    label: 'Emotional',
    gradient: 'bg-gradient-to-r from-rose-500 to-pink-600',
  },
  Funny: {
    label: 'Funny',
    gradient: 'bg-gradient-to-r from-orange-500 to-red-500',
  },
  Modern: {
    label: 'Modern',
    gradient: 'bg-gradient-to-r from-slate-500 to-gray-600',
  },
  Romantic: {
    label: 'Romantic',
    gradient: 'bg-gradient-to-r from-red-500 to-pink-600',
  },
};

/**
 * Get style tag for a wish based on metadata
 */
export function getStyleTag(wish: SampleWish): StyleTag {
  // Use explicit styleTag if available
  if (wish.styleTag && STYLE_TAG_MAP[wish.styleTag]) {
    return STYLE_TAG_MAP[wish.styleTag];
  }
  
  // Fallback to tone-based mapping
  const toneMap: Record<string, string> = {
    funny: 'Funny',
    romantic: 'Romantic',
    emotional: 'Emotional',
    formal: 'Modern',
    'short & sweet': 'Cute',
    'light roast': 'Funny',
  };
  
  const tagKey = toneMap[wish.tone.toLowerCase()] || 'Modern';
  return STYLE_TAG_MAP[tagKey];
}
