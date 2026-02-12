import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import type { SampleWish } from '../sampleWishes';
import { formatExampleWish } from '../exampleWishFormat';
import { enhanceTitle, enhanceBody, getDecorationEmojis } from '../exampleWishEmoji';
import { getCardTheme } from '../exampleWishThemes';
import { getStyleTag } from '../exampleWishTags';

interface ExampleWishCardProps {
  wish: SampleWish;
  onUseStyle: (wish: SampleWish) => void;
}

export function ExampleWishCard({ wish, onUseStyle }: ExampleWishCardProps) {
  const [variationIndex, setVariationIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const formatted = formatExampleWish(wish);
  const theme = getCardTheme(wish, variationIndex);
  const styleTag = getStyleTag(wish);
  const decorationEmojis = getDecorationEmojis(wish, variationIndex);
  
  const enhancedTitle = enhanceTitle(formatted.title, wish, variationIndex);
  const enhancedBody = enhanceBody(formatted.body, wish, variationIndex);
  
  const handleVariationChange = (index: number) => {
    setVariationIndex(index);
  };
  
  return (
    <Card
      className="relative overflow-hidden bg-card/80 backdrop-blur-sm border-neon-purple/20 transition-all duration-300 h-full flex flex-col group"
      style={{
        boxShadow: isHovered ? theme.background.glow : undefined,
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 ${theme.background.gradient} opacity-60`} />
      
      {/* Texture overlay */}
      {theme.background.texture && (
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url(${theme.background.texture})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      
      {/* Sparkle/confetti overlay */}
      {theme.background.overlay && (
        <div
          className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage: `url(${theme.background.overlay})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      
      {/* Floating decoration emojis */}
      {isHovered && decorationEmojis.map((emoji, idx) => (
        <div
          key={idx}
          className="absolute text-2xl animate-float-emoji pointer-events-none"
          style={{
            top: `${15 + idx * 25}%`,
            right: `${10 + idx * 15}%`,
            animationDelay: `${idx * 0.3}s`,
          }}
        >
          {emoji}
        </div>
      ))}
      
      {/* Content */}
      <div className="relative z-10 p-5 flex flex-col flex-1">
        {/* Style tag badge */}
        <div className="mb-3">
          <Badge className={`${styleTag.gradient} text-white border-0 text-xs font-semibold px-3 py-1`}>
            {styleTag.label}
          </Badge>
        </div>
        
        {/* Title */}
        <h3
          className={`${theme.typography.titleFont} ${theme.typography.titleSize} font-bold text-foreground mb-3 leading-tight line-clamp-2`}
        >
          {enhancedTitle}
        </h3>
        
        {/* Body message */}
        <p
          className={`${theme.typography.bodyFont} ${theme.typography.bodySize} text-foreground/90 leading-relaxed mb-4 flex-1 line-clamp-3`}
        >
          {enhancedBody}
        </p>
        
        {/* Variation dots */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => handleVariationChange(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  variationIndex === idx
                    ? 'bg-neon-purple w-6'
                    : 'bg-foreground/30 hover:bg-foreground/50'
                }`}
                aria-label={`Variation ${idx + 1}`}
              />
            ))}
          </div>
          
          {/* Use This Style button (visible on hover) */}
          <Button
            size="sm"
            onClick={() => onUseStyle(wish)}
            className={`transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            } bg-neon-purple hover:bg-neon-purple/90 text-white`}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Use Style
          </Button>
        </div>
      </div>
      
      {/* Glow border effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 border-2 border-neon-purple/50 rounded-lg pointer-events-none" />
      )}
    </Card>
  );
}
