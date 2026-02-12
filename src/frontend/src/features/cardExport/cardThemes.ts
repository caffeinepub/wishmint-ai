/**
 * Premium card themes for export/preview
 */

export type CardTheme = 'luxury' | 'cute' | 'cinematic' | 'modern-instagram';

export interface ThemeConfig {
  id: CardTheme;
  name: string;
  backgroundAsset: string;
  titleFont: string;
  messageFont: string;
  footerFont: string;
  titleColor: string;
  messageColor: string;
  footerColor: string;
  titleGlow: string;
  decorationStyle: 'sparkles' | 'confetti' | 'minimal' | 'bokeh';
  decorationColor: string;
}

export const CARD_THEMES: Record<CardTheme, ThemeConfig> = {
  'luxury': {
    id: 'luxury',
    name: 'Luxury',
    backgroundAsset: '/assets/generated/card-bg-luxury-black-gold-premium.dim_1080x1080.png',
    titleFont: 'Playfair Display, Georgia, serif',
    messageFont: 'Montserrat, Helvetica, sans-serif',
    footerFont: 'Dancing Script, cursive',
    titleColor: '#FFD700',
    messageColor: '#FFFFFF',
    footerColor: 'rgba(255, 255, 255, 0.7)',
    titleGlow: 'rgba(255, 215, 0, 0.6)',
    decorationStyle: 'minimal',
    decorationColor: '#FFD700',
  },
  'cute': {
    id: 'cute',
    name: 'Cute',
    backgroundAsset: '/assets/generated/card-bg-cute-pastel-balloons-premium.dim_1080x1080.png',
    titleFont: 'Comic Sans MS, Chalkboard SE, cursive',
    messageFont: 'Quicksand, Arial, sans-serif',
    footerFont: 'Patrick Hand, cursive',
    titleColor: '#FF69B4',
    messageColor: '#4A4A4A',
    footerColor: 'rgba(74, 74, 74, 0.7)',
    titleGlow: 'rgba(255, 105, 180, 0.5)',
    decorationStyle: 'confetti',
    decorationColor: '#FF69B4',
  },
  'cinematic': {
    id: 'cinematic',
    name: 'Cinematic',
    backgroundAsset: '/assets/generated/card-bg-cinematic-warm-bokeh-premium.dim_1080x1080.png',
    titleFont: 'Cinzel, Georgia, serif',
    messageFont: 'Lato, Helvetica, sans-serif',
    footerFont: 'Great Vibes, cursive',
    titleColor: '#FFFFFF',
    messageColor: '#F5F5F5',
    footerColor: 'rgba(255, 255, 255, 0.8)',
    titleGlow: 'rgba(255, 255, 255, 0.8)',
    decorationStyle: 'bokeh',
    decorationColor: '#FFFFFF',
  },
  'modern-instagram': {
    id: 'modern-instagram',
    name: 'Modern Instagram',
    backgroundAsset: '/assets/generated/card-bg-modern-instagram-gradient-premium.dim_1080x1080.png',
    titleFont: 'Poppins, Helvetica, sans-serif',
    messageFont: 'Inter, Arial, sans-serif',
    footerFont: 'Caveat, cursive',
    titleColor: '#FFFFFF',
    messageColor: '#FFFFFF',
    footerColor: 'rgba(255, 255, 255, 0.85)',
    titleGlow: 'rgba(138, 43, 226, 0.6)',
    decorationStyle: 'sparkles',
    decorationColor: '#FFFFFF',
  },
};

export function getThemeConfig(themeId: CardTheme): ThemeConfig {
  return CARD_THEMES[themeId];
}

export function getDefaultTheme(): ThemeConfig {
  return CARD_THEMES['luxury'];
}
