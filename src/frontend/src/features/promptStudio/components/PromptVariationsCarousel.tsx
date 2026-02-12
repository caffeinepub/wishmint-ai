/**
 * Carousel UI for switching between 3 AI-generated card variations
 */

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PromptVariationsCarouselProps {
  totalVariations: number;
  selectedIndex: number;
  onSelectVariation: (index: number) => void;
}

export function PromptVariationsCarousel({
  totalVariations,
  selectedIndex,
  onSelectVariation,
}: PromptVariationsCarouselProps) {
  const handlePrevious = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : totalVariations - 1;
    onSelectVariation(newIndex);
  };

  const handleNext = () => {
    const newIndex = selectedIndex < totalVariations - 1 ? selectedIndex + 1 : 0;
    onSelectVariation(newIndex);
  };

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        className="h-8 w-8 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Previous variation"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalVariations }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelectVariation(index)}
            className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              index === selectedIndex
                ? 'w-8 bg-brand-purple'
                : 'w-2 bg-border hover:bg-border/60'
            }`}
            aria-label={`Variation ${index + 1}`}
            aria-current={index === selectedIndex ? 'true' : undefined}
          />
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        className="h-8 w-8 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Next variation"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <span className="text-sm text-muted-foreground ml-2">
        Variation {selectedIndex + 1}/{totalVariations}
      </span>
    </div>
  );
}
