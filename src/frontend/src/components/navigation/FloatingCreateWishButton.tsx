import { Button } from '@/components/ui/button';
import { smoothScrollToAnchor } from '../../lib/scroll';

/**
 * Floating quick action button to scroll to the Wish Generator section
 * Positioned bottom-right with mobile-safe spacing
 */
export function FloatingCreateWishButton() {
  const handleClick = () => {
    smoothScrollToAnchor('create-wish');
  };

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-gradient-to-r from-neon-purple to-neon-green shadow-neon hover:opacity-90 transition-all hover:scale-105 text-white font-semibold px-6 py-6 rounded-full"
    >
      🎂 Create Wish
    </Button>
  );
}
