/**
 * Local rule-based structured text generation for Prompt Mode
 * Generates title, message, and footer from prompt analysis
 */

import type { PromptAnalysis, CardContent, EventType, ToneType } from './types';

const EVENT_TITLES: Record<EventType, string[]> = {
  'birthday': ['Happy Birthday!', 'Birthday Wishes', 'Celebrate Your Day'],
  'wedding': ['Congratulations!', 'Best Wishes', 'Happily Ever After'],
  'anniversary': ['Happy Anniversary!', 'Celebrating Love', 'Years of Joy'],
  'party': ['You\'re Invited!', 'Join the Celebration', 'Let\'s Celebrate'],
  'corporate': ['You\'re Invited', 'Join Us', 'Special Event'],
  'festival': ['Happy Holidays!', 'Season\'s Greetings', 'Festive Wishes'],
  'baby-shower': ['Baby Shower', 'Welcome Baby', 'Celebrating Soon'],
  'graduation': ['Congratulations Graduate!', 'Well Done!', 'Success Ahead'],
  'love-card': ['With Love', 'You\'re Special', 'Thinking of You'],
  'general': ['Celebrate', 'Special Wishes', 'For You'],
};

const TONE_MESSAGE_TEMPLATES: Record<ToneType, string[]> = {
  'formal': [
    'We cordially invite you to join us for this special occasion.',
    'Your presence would be an honor as we celebrate this milestone.',
    'Please join us in commemorating this significant event.',
  ],
  'romantic': [
    'Every moment with you is a treasure. Here\'s to many more beautiful memories together.',
    'You make every day brighter. Celebrating the love we share.',
    'My heart is full because of you. Forever grateful for your love.',
  ],
  'emotional': [
    'This special day reminds us of all the wonderful moments we\'ve shared together.',
    'Your presence in our lives brings so much joy and happiness.',
    'Celebrating you today and always. You mean the world to us.',
  ],
  'fun': [
    'Get ready for an amazing celebration! It\'s going to be epic!',
    'Time to party and make unforgettable memories together!',
    'Let\'s celebrate in style! Fun, laughter, and good times await!',
  ],
  'luxury': [
    'An exclusive celebration awaits. Join us for an elegant affair.',
    'Experience a sophisticated evening of celebration and refinement.',
    'A premium celebration designed with elegance and grace.',
  ],
  'cute': [
    'You\'re invited to the sweetest celebration ever! Can\'t wait to see you!',
    'Sending you the biggest hugs and warmest wishes on this special day!',
    'You\'re absolutely wonderful! Let\'s celebrate together!',
  ],
  'professional': [
    'We request the pleasure of your company at this professional gathering.',
    'Join us for an important milestone in our journey.',
    'Your attendance is valued as we mark this achievement.',
  ],
  'casual': [
    'Hey! Come celebrate with us. It\'s going to be great!',
    'You\'re invited to join the fun. Looking forward to seeing you!',
    'Let\'s get together and celebrate! Hope you can make it!',
  ],
};

function selectRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateTitle(analysis: PromptAnalysis): string {
  const titles = EVENT_TITLES[analysis.eventType];
  return selectRandom(titles);
}

function generateMessage(analysis: PromptAnalysis): string {
  const templates = TONE_MESSAGE_TEMPLATES[analysis.tone];
  return selectRandom(templates);
}

function generateFooter(): string {
  return 'Created with WishMint';
}

export function generateCardContent(analysis: PromptAnalysis): CardContent {
  return {
    title: generateTitle(analysis),
    message: generateMessage(analysis),
    footer: generateFooter(),
  };
}

export function regenerateCardContent(
  analysis: PromptAnalysis,
  customTone?: ToneType
): CardContent {
  const effectiveAnalysis = customTone
    ? { ...analysis, tone: customTone }
    : analysis;
  
  return generateCardContent(effectiveAnalysis);
}
