import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Minimal decorative sparkle overlay component
 * Uses the existing sparkle texture asset with subtle animation
 * Respects reduced-motion preferences
 */
export function SparkleOverlay() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-0 opacity-20"
      style={{
        backgroundImage: 'url(/assets/generated/examples-overlay-sparkles.dim_512x512.png)',
        backgroundSize: '512px 512px',
        backgroundRepeat: 'repeat',
        mixBlendMode: 'screen',
      }}
    >
      <div 
        className={prefersReducedMotion ? '' : 'animate-sparkle'}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/assets/generated/examples-overlay-sparkles.dim_512x512.png)',
          backgroundSize: '512px 512px',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'screen',
          willChange: prefersReducedMotion ? 'auto' : 'opacity, transform',
        }}
      />
    </div>
  );
}
