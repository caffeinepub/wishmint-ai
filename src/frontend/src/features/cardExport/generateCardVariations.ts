/**
 * Generates 2-3 design variation parameters adjusting non-text render settings
 * (decoration offset, vignette intensity, glow, layout) while keeping
 * Title/Message/Footer identical
 */

import type { CardVariationParams } from './canvasExport';

export function generateCardVariations(): CardVariationParams[] {
  return [
    {
      decorationOffset: 0,
      vignetteIntensity: 0.3,
      glowIntensity: 0.8,
      layoutVariant: 'centered',
    },
    {
      decorationOffset: 20,
      vignetteIntensity: 0.5,
      glowIntensity: 0.5,
      layoutVariant: 'top-heavy',
    },
    {
      decorationOffset: 40,
      vignetteIntensity: 0.2,
      glowIntensity: 1.0,
      layoutVariant: 'bottom-heavy',
    },
  ];
}
