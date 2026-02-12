/**
 * Generates 2-3 design variations for a card
 * Variations adjust non-text parameters while keeping Title/Message/Footer identical
 */

export interface CardVariationParams {
  decorationOffset: number;
  vignetteIntensity: number;
  glowIntensity: number;
  decorationCount: number;
  layoutVariant: 'centered' | 'top-heavy' | 'balanced';
}

/**
 * Generates variation parameters for a given index
 */
export function getVariationParams(variationIndex: number): CardVariationParams {
  const variations: CardVariationParams[] = [
    {
      decorationOffset: 0,
      vignetteIntensity: 0.3,
      glowIntensity: 1.0,
      decorationCount: 12,
      layoutVariant: 'centered',
    },
    {
      decorationOffset: 20,
      vignetteIntensity: 0.4,
      glowIntensity: 0.8,
      decorationCount: 16,
      layoutVariant: 'balanced',
    },
    {
      decorationOffset: -15,
      vignetteIntensity: 0.25,
      glowIntensity: 1.2,
      decorationCount: 10,
      layoutVariant: 'top-heavy',
    },
  ];
  
  return variations[variationIndex % variations.length];
}

/**
 * Returns the number of variations to generate
 */
export function getVariationCount(): number {
  return 3;
}
