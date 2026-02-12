/**
 * Type definitions for Prompt Studio mode
 */

import type { CardVariation } from './generateCardFromPrompt';

export type EventType = 
  | 'birthday'
  | 'wedding'
  | 'anniversary'
  | 'party'
  | 'corporate'
  | 'festival'
  | 'baby-shower'
  | 'graduation'
  | 'love-card'
  | 'general';

export type ToneType = 
  | 'formal'
  | 'romantic'
  | 'emotional'
  | 'fun'
  | 'luxury'
  | 'cute'
  | 'professional'
  | 'casual';

export type VisualTheme = 
  | 'floral'
  | 'royal'
  | 'minimal'
  | 'modern'
  | 'cartoon'
  | 'elegant'
  | 'luxury'
  | 'pastel'
  | 'neon'
  | 'cinematic';

export type LayoutStyle = 
  | 'invitation'
  | 'greeting-card'
  | 'poster'
  | 'social-media';

export interface PromptAnalysis {
  eventType: EventType;
  tone: ToneType;
  visualTheme: VisualTheme;
  layoutStyle: LayoutStyle;
  keywords: string[];
}

export interface CardContent {
  title: string;
  message: string;
  footer: string;
}

export interface PromptStudioState {
  prompt: string;
  analysis: PromptAnalysis | null;
  content: CardContent | null;
  selectedTone: ToneType | null;
  regenerateCounter: number;
  aiVariations: CardVariation[] | null;
  selectedVariationIndex: number;
}

export const EXAMPLE_PROMPTS = [
  'Luxury birthday invitation for 50th birthday',
  'Cute baby shower invitation',
  'Romantic anniversary wish card',
  'Elegant wedding invitation',
];
