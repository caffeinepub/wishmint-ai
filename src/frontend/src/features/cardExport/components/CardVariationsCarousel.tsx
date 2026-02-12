import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';

interface CardVariationsCarouselProps {
  variations: string[]; // Array of blob URLs
  onVariationSelect: (index: number) => void;
  selectedIndex: number;
}

export function CardVariationsCarousel({
  variations,
  onVariationSelect,
  selectedIndex,
}: CardVariationsCarouselProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const carouselRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const handlePrevious = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : variations.length - 1;
    onVariationSelect(newIndex);
  };

  const handleNext = () => {
    const newIndex = selectedIndex < variations.length - 1 ? selectedIndex + 1 : 0;
    onVariationSelect(newIndex);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const dx = touchStart.x - touchEnd.x;
    const dy = touchStart.y - touchEnd.y;
    
    // Only treat as swipe if horizontal movement dominates vertical movement
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipeDistance) {
      const isLeftSwipe = dx > 0;
      const isRightSwipe = dx < 0;

      if (isLeftSwipe) {
        handleNext();
      } else if (isRightSwipe) {
        handlePrevious();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ignore if focus is in an input, textarea, or contenteditable
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        ref={carouselRef}
        className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role="region"
        aria-label="Card variations carousel"
      >
        {/* Main card display */}
        <div
          className="relative overflow-hidden rounded-lg"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Card className="bg-transparent border-none shadow-none">
            <div className="aspect-square w-full">
              <img
                src={variations[selectedIndex]}
                alt={`Card variation ${selectedIndex + 1}`}
                className={`w-full h-full object-cover rounded-lg ${
                  prefersReducedMotion ? '' : 'transition-opacity duration-300'
                }`}
              />
            </div>
          </Card>
        </div>

        {/* Navigation arrows (desktop) */}
        <div className="hidden md:block">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={handlePrevious}
            aria-label="Previous variation"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={handleNext}
            aria-label="Next variation"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {variations.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onVariationSelect(index)}
            className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              index === selectedIndex
                ? 'bg-neon-purple w-6'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2'
            }`}
            aria-label={`View variation ${index + 1}`}
            aria-current={index === selectedIndex ? 'true' : undefined}
          />
        ))}
      </div>

      {/* Variation counter */}
      <p className="text-center text-sm text-muted-foreground mt-2">
        Variation {selectedIndex + 1} of {variations.length}
      </p>
    </div>
  );
}
