/**
 * Event-adaptive theme mapping
 * Maps detected event types to recommended card themes
 */

import type { EventType } from './types';
import type { CardTheme } from '../cardExport/cardThemes';

export const EVENT_THEME_MAP: Record<EventType, CardTheme> = {
  'birthday': 'cute',
  'wedding': 'luxury',
  'anniversary': 'cinematic',
  'party': 'modern-instagram',
  'corporate': 'luxury',
  'festival': 'modern-instagram',
  'baby-shower': 'cute',
  'graduation': 'luxury',
  'love-card': 'cinematic',
  'general': 'modern-instagram',
};

export function getRecommendedTheme(eventType: EventType): CardTheme {
  return EVENT_THEME_MAP[eventType];
}
