import { useState, useEffect } from 'react';
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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

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
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, variations.length]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
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
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={handlePrevious}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={handleNext}
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
            onClick={() => onVariationSelect(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === selectedIndex
                ? 'bg-neon-purple w-6'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`View variation ${index + 1}`}
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
