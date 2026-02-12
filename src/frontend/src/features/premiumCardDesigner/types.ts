export type PremiumThemeId = 'cute-pastel' | 'romantic-love' | 'minimal-luxury' | 'neon-party' | 'anime-aesthetic';

export type BackgroundStyle = 'gradient' | 'glassmorphism';
export type FontStyle = 'rounded' | 'elegant' | 'modern' | 'handwritten';
export type TextAlignment = 'left' | 'center' | 'right';
export type BorderStyle = 'none' | 'solid' | 'decorative';
export type PhotoPlacement = 'top' | 'center' | 'bottom';

export interface PremiumTheme {
  id: PremiumThemeId;
  name: string;
  description: string;
  icon: string;
  backgroundGradient: string;
  backgroundColors: [string, string];
  textColor: string;
  accentColor: string;
  decorativeEmojis: string[];
  fontFamily: string;
  borderColor: string;
  glowColor: string;
}

export interface PremiumDesignerState {
  selectedTheme: PremiumThemeId;
  backgroundStyle: BackgroundStyle;
  fontStyle: FontStyle;
  fontColor: string;
  textAlignment: TextAlignment;
  emojiDecorationsEnabled: boolean;
  borderStyle: BorderStyle;
  animationsEnabled: boolean;
  uploadedPhoto: string | null;
  photoPlacement: PhotoPlacement;
}
