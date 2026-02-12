import { forwardRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '../components/Reveal';
import { SAMPLE_WISHES } from '../features/examples/sampleWishes';

export const ExamplesSection = forwardRef<HTMLDivElement>((_, ref) => {
  const [toneFilter, setToneFilter] = useState<string>('all');

  const filteredWishes =
    toneFilter === 'all'
      ? SAMPLE_WISHES
      : SAMPLE_WISHES.filter((wish) => wish.tone === toneFilter);

  return (
    <section ref={ref} className="section-padding px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neon-green/5 to-background">
      <div className="section-container max-w-6xl">
        <Reveal>
          <div className="text-center mb-12 space-y-4">
            <h2 className="section-heading bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              Example Wishes
            </h2>
            <p className="section-subheading mb-6">
              Get inspired by these sample birthday wishes
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWishes.map((wish, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <Card className="bg-card/70 backdrop-blur-sm border-neon-purple/20 hover:border-neon-purple/40 transition-all shadow-card h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center justify-between">
                    <span>{wish.name}</span>
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap pt-1">
                    <Badge variant="outline" className="border-neon-purple/50 text-xs">
                      {wish.tone}
                    </Badge>
                    <Badge variant="outline" className="border-neon-green/50 text-xs">
                      {wish.relationship}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/90 leading-relaxed text-sm">{wish.wish}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
});

ExamplesSection.displayName = 'ExamplesSection';
