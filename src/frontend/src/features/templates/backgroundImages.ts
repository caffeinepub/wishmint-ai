// Central registry of static background image paths for templates
export const BACKGROUND_IMAGES: Record<string, string> = {
  'confetti-dark': '/assets/generated/card-bg-confetti-dark.dim_1080x1080.png',
  'neon-balloons': '/assets/generated/card-bg-neon-balloons.dim_1080x1080.png',
  'pastel-sparkles': '/assets/generated/card-bg-pastel-sparkles.dim_1080x1080.png',
  'minimal-gold-lines': '/assets/generated/card-bg-minimal-gold-lines.dim_1080x1080.png',
  'cute-doodles': '/assets/generated/card-bg-cute-doodles.dim_1080x1080.png',
  'luxury-marble': '/assets/generated/card-bg-luxury-marble.dim_1080x1080.png',
  'anime-starburst': '/assets/generated/card-bg-anime-starburst.dim_1080x1080.png',
  'classic-bokeh': '/assets/generated/card-bg-classic-bokeh.dim_1080x1080.png',
};

export function getBackgroundImagePath(imageKey: string): string {
  return BACKGROUND_IMAGES[imageKey] || '';
}
