import type { SampleWish } from './sampleWishes';

export interface TypographyTheme {
  titleFont: string;
  bodyFont: string;
  titleSize: string;
  bodySize: string;
}

export interface BackgroundTheme {
  gradient: string;
  texture?: string;
  overlay?: string;
  glow: string;
}

export interface CardTheme {
  typography: TypographyTheme;
  background: BackgroundTheme;
  name: string;
}

// Typography themes
const TYPOGRAPHY_THEMES: Record<string, TypographyTheme> = {
  cute: {
    titleFont: 'font-display-cute',
    bodyFont: 'font-sans',
    titleSize: 'text-xl sm:text-2xl',
    bodySize: 'text-sm sm:text-base',
  },
  luxury: {
    titleFont: 'font-display-luxury',
    bodyFont: 'font-sans',
    titleSize: 'text-xl sm:text-2xl',
    bodySize: 'text-sm sm:text-base',
  },
  modern: {
    titleFont: 'font-display-modern',
    bodyFont: 'font-sans',
    titleSize: 'text-xl sm:text-2xl',
    bodySize: 'text-sm sm:text-base',
  },
  emotional: {
    titleFont: 'font-script',
    bodyFont: 'font-sans',
    titleSize: 'text-2xl sm:text-3xl',
    bodySize: 'text-sm sm:text-base',
  },
};

// Background themes
const BACKGROUND_THEMES: Record<string, BackgroundTheme> = {
  cutePastel: {
    gradient: 'bg-gradient-to-br from-pink-400/20 via-purple-300/20 to-blue-300/20',
    texture: '/assets/generated/examples-texture-paper.dim_512x512.png',
    overlay: '/assets/generated/examples-overlay-sparkles.dim_512x512.png',
    glow: 'shadow-[0_0_30px_rgba(236,72,153,0.3)]',
  },
  luxuryGold: {
    gradient: 'bg-gradient-to-br from-amber-600/30 via-yellow-500/20 to-amber-700/30',
    texture: '/assets/generated/examples-texture-shimmer.dim_512x512.png',
    glow: 'shadow-[0_0_30px_rgba(217,119,6,0.4)]',
  },
  neonGlow: {
    gradient: 'bg-gradient-to-br from-neon-purple/30 via-neon-green/20 to-neon-purple/30',
    overlay: '/assets/generated/examples-overlay-sparkles.dim_512x512.png',
    glow: 'shadow-neon',
  },
  minimalClean: {
    gradient: 'bg-gradient-to-br from-slate-700/40 via-slate-600/30 to-slate-700/40',
    glow: 'shadow-[0_0_20px_rgba(100,116,139,0.3)]',
  },
  animeSoft: {
    gradient: 'bg-gradient-to-br from-purple-400/25 via-pink-300/25 to-blue-400/25',
    texture: '/assets/generated/examples-texture-anime-soft.dim_512x512.png',
    overlay: '/assets/generated/examples-overlay-sparkles.dim_512x512.png',
    glow: 'shadow-[0_0_25px_rgba(192,132,252,0.35)]',
  },
};

/**
 * Seeded random selection for stable theme assignment
 */
function seededRandom(seed: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash) % max;
}

/**
 * Get typography theme for a card variation
 */
export function getTypographyTheme(wish: SampleWish, variationIndex: number): TypographyTheme {
  const seed = `${wish.name}-${wish.relationship}-${variationIndex}`;
  const themes = Object.values(TYPOGRAPHY_THEMES);
  const index = seededRandom(seed, themes.length);
  return themes[index];
}

/**
 * Get background theme for a card variation
 */
export function getBackgroundTheme(wish: SampleWish, variationIndex: number): BackgroundTheme {
  const seed = `${wish.name}-${wish.tone}-${variationIndex}`;
  const themes = Object.values(BACKGROUND_THEMES);
  const index = seededRandom(seed, themes.length);
  return themes[index];
}

/**
 * Get complete card theme (typography + background)
 */
export function getCardTheme(wish: SampleWish, variationIndex: number): CardTheme {
  const typography = getTypographyTheme(wish, variationIndex);
  const background = getBackgroundTheme(wish, variationIndex);
  
  const themeNames = ['Cute Pastel', 'Luxury Gold', 'Neon Glow', 'Minimal Clean', 'Anime Soft'];
  const seed = `${wish.name}-${variationIndex}`;
  const nameIndex = seededRandom(seed, themeNames.length);
  
  return {
    typography,
    background,
    name: themeNames[nameIndex],
  };
}
