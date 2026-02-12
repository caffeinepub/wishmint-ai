import { useScrollProgress } from '../../hooks/useScrollProgress';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Thin fixed progress bar at the top of viewport showing scroll progress
 * with WishMint brand gradient (purple → blue → green)
 */
export function ScrollProgressBar() {
  const progress = useScrollProgress();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent pointer-events-none">
      <div
        className="h-full origin-left"
        style={{
          background: 'linear-gradient(90deg, #7C3AED 0%, #3B82F6 50%, #22C55E 100%)',
          width: `${progress * 100}%`,
          transition: prefersReducedMotion ? 'none' : 'width 0.1s ease-out',
        }}
      />
    </div>
  );
}
