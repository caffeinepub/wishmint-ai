/**
 * Deterministic rule-based prompt analysis
 * Detects event type, tone, visual theme, and layout style from user prompts
 */

import type { PromptAnalysis, EventType, ToneType, VisualTheme, LayoutStyle } from './types';

const EVENT_KEYWORDS: Record<EventType, string[]> = {
  'birthday': ['birthday', 'bday', 'b-day', 'born', 'birth'],
  'wedding': ['wedding', 'marriage', 'bride', 'groom', 'nuptial', 'matrimony'],
  'anniversary': ['anniversary', 'years together', 'celebrate us'],
  'party': ['party', 'celebration', 'bash', 'get-together', 'gathering'],
  'corporate': ['corporate', 'business', 'company', 'professional', 'office', 'team'],
  'festival': ['festival', 'diwali', 'christmas', 'eid', 'hanukkah', 'holiday'],
  'baby-shower': ['baby shower', 'baby', 'newborn', 'expecting', 'pregnancy'],
  'graduation': ['graduation', 'graduate', 'degree', 'diploma', 'commencement'],
  'love-card': ['love', 'valentine', 'romantic', 'sweetheart', 'darling'],
  'general': [],
};

const TONE_KEYWORDS: Record<ToneType, string[]> = {
  'formal': ['formal', 'elegant', 'sophisticated', 'professional', 'dignified'],
  'romantic': ['romantic', 'love', 'sweetheart', 'passion', 'intimate'],
  'emotional': ['emotional', 'heartfelt', 'touching', 'sentimental', 'meaningful'],
  'fun': ['fun', 'playful', 'cheerful', 'happy', 'joyful', 'exciting'],
  'luxury': ['luxury', 'luxurious', 'premium', 'golden', 'royal', 'opulent'],
  'cute': ['cute', 'adorable', 'sweet', 'lovely', 'charming'],
  'professional': ['professional', 'business', 'corporate', 'official'],
  'casual': ['casual', 'friendly', 'relaxed', 'informal', 'simple'],
};

const THEME_KEYWORDS: Record<VisualTheme, string[]> = {
  'floral': ['floral', 'flower', 'flowers', 'botanical', 'garden'],
  'royal': ['royal', 'regal', 'crown', 'throne', 'majestic'],
  'minimal': ['minimal', 'minimalist', 'simple', 'clean', 'modern'],
  'modern': ['modern', 'contemporary', 'trendy', 'stylish'],
  'cartoon': ['cartoon', 'animated', 'playful', 'illustrated'],
  'elegant': ['elegant', 'graceful', 'refined', 'classy'],
  'luxury': ['luxury', 'luxurious', 'gold', 'golden', 'premium'],
  'pastel': ['pastel', 'soft', 'light', 'gentle'],
  'neon': ['neon', 'bright', 'vibrant', 'electric'],
  'cinematic': ['cinematic', 'dramatic', 'movie', 'film'],
};

const LAYOUT_KEYWORDS: Record<LayoutStyle, string[]> = {
  'invitation': ['invitation', 'invite', 'inviting', 'rsvp'],
  'greeting-card': ['card', 'greeting', 'wish', 'message'],
  'poster': ['poster', 'announcement', 'banner'],
  'social-media': ['instagram', 'facebook', 'social', 'story', 'post'],
};

function detectFromKeywords<T extends string>(
  prompt: string,
  keywords: Record<T, string[]>,
  defaultValue: T
): T {
  const lowerPrompt = prompt.toLowerCase();
  
  for (const [key, words] of Object.entries(keywords) as [T, string[]][]) {
    for (const word of words) {
      if (lowerPrompt.includes(word)) {
        return key;
      }
    }
  }
  
  return defaultValue;
}

function extractKeywords(prompt: string): string[] {
  const lowerPrompt = prompt.toLowerCase();
  const keywords: string[] = [];
  
  // Extract all matching keywords from all categories
  const allKeywords = [
    ...Object.values(EVENT_KEYWORDS).flat(),
    ...Object.values(TONE_KEYWORDS).flat(),
    ...Object.values(THEME_KEYWORDS).flat(),
  ];
  
  for (const keyword of allKeywords) {
    if (lowerPrompt.includes(keyword)) {
      keywords.push(keyword);
    }
  }
  
  return [...new Set(keywords)].slice(0, 5); // Unique, max 5
}

export function analyzePrompt(prompt: string): PromptAnalysis {
  const eventType = detectFromKeywords(prompt, EVENT_KEYWORDS, 'general');
  const tone = detectFromKeywords(prompt, TONE_KEYWORDS, 'casual');
  const visualTheme = detectFromKeywords(prompt, THEME_KEYWORDS, 'modern');
  const layoutStyle = detectFromKeywords(prompt, LAYOUT_KEYWORDS, 'greeting-card');
  const keywords = extractKeywords(prompt);
  
  return {
    eventType,
    tone,
    visualTheme,
    layoutStyle,
    keywords,
  };
}
