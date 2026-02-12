import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { smoothScrollToAnchor } from '../../lib/scroll';
import { useScrollProgress } from '../../hooks/useScrollProgress';

/**
 * Floating Back to Top button that appears after scrolling 30% down the page
 * Positioned bottom-right with mobile-safe spacing
 */
export function FloatingBackToTopButton() {
  const scrollProgress = useScrollProgress();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(scrollProgress >= 0.3);
  }, [scrollProgress]);

  const handleClick = () => {
    smoothScrollToAnchor('home');
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={handleClick}
      size="icon"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 h-12 w-12 rounded-full bg-gradient-to-r from-neon-purple to-neon-green shadow-neon hover:opacity-90 transition-all hover:scale-110"
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5 text-white" />
    </Button>
  );
}
