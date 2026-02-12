import { forwardRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Reveal } from '../components/Reveal';
import { SAMPLE_WISHES } from '../features/examples/sampleWishes';
import { ExampleWishCard } from '../features/examples/components/ExampleWishCard';
import { useAppContext } from '../App';
import type { SampleWish } from '../features/examples/sampleWishes';
import type { Relationship, Tone } from '../features/generator/types';

export const ExamplesSection = forwardRef<HTMLDivElement>((_, ref) => {
  const [toneFilter, setToneFilter] = useState<string>('all');
  const { setFormData } = useAppContext();

  const filteredWishes =
    toneFilter === 'all'
      ? SAMPLE_WISHES
      : SAMPLE_WISHES.filter((wish) => wish.tone === toneFilter);

  const handleUseStyle = (wish: SampleWish) => {
    // Prefill generator form with example data
    setFormData((prev) => ({
      ...prev,
      name: wish.name,
      relationship: wish.relationship as Relationship,
      tone: wish.tone as Tone,
    }));

    // Scroll to generator section
    const generatorSection = document.querySelector('[data-section="generator"]');
    if (generatorSection) {
      generatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Focus name input after scroll
      setTimeout(() => {
        const nameInput = document.querySelector<HTMLInputElement>('input[name="name"]');
        nameInput?.focus();
      }, 500);
    }
  };

  return (
    <section ref={ref} className="section-padding px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neon-green/5 to-background">
      <div className="section-container max-w-7xl">
        <Reveal>
          <div className="text-center mb-12 space-y-4">
            <h2 className="section-heading bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              Example Wishes
            </h2>
            <p className="section-subheading mb-6">
              Premium social-style birthday cards to inspire your perfect message
            </p>

            <div className="flex justify-center">
              <div className="w-full max-w-xs">
                <Select value={toneFilter} onValueChange={setToneFilter}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Filter by tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tones</SelectItem>
                    <SelectItem value="emotional">Emotional</SelectItem>
                    <SelectItem value="funny">Funny</SelectItem>
                    <SelectItem value="romantic">Romantic</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="short & sweet">Short & Sweet</SelectItem>
                    <SelectItem value="light roast">Light Roast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Masonry-like responsive grid */}
        <div className="examples-gallery">
          {filteredWishes.map((wish, index) => (
            <Reveal key={`${wish.name}-${wish.relationship}-${index}`} delay={index * 0.05}>
              <div className="examples-gallery-item">
                <ExampleWishCard wish={wish} onUseStyle={handleUseStyle} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
});

ExamplesSection.displayName = 'ExamplesSection';
