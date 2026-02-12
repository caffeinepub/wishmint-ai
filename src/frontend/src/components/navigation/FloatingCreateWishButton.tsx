import { Button } from '@/components/ui/button';
import { smoothScrollToAnchor } from '../../lib/scroll';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Floating quick action button to scroll to the Wish Generator section
 * Positioned bottom-right with mobile-safe spacing and premium gradient styling
 */
export function FloatingCreateWishButton() {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const handleClick = () => {
    smoothScrollToAnchor('create-wish');
  };

  return (
    <Button
      onClick={handleClick}
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 btn-primary-gradient text-white font-semibold px-6 py-6 rounded-full ${
        prefersReducedMotion ? '' : 'hover:scale-105'
      } transition-all`}
      style={{ transitionProperty: 'transform, box-shadow' }}
    >
      🎂 Create Wish
    </Button>
  );
}
