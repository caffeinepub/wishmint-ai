import { useScrollProgress } from '../../hooks/useScrollProgress';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Thin fixed progress bar at the top of viewport showing scroll progress
 * with WishMint gradient and smooth animation
 */
export function ScrollProgressBar() {
  const progress = useScrollProgress();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-neon-purple via-neon-green to-neon-purple origin-left"
        style={{
          width: `${progress * 100}%`,
          transition: prefersReducedMotion ? 'none' : 'width 0.1s ease-out',
        }}
      />
    </div>
  );
}
