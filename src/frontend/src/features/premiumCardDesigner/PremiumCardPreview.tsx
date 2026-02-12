import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import type { PremiumDesignerState } from './types';
import { getThemeById } from './themes';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface PremiumCardPreviewProps {
  designerState: PremiumDesignerState;
  wishText: string;
  recipientName: string;
}

export function PremiumCardPreview({ designerState, wishText, recipientName }: PremiumCardPreviewProps) {
  const theme = getThemeById(designerState.selectedTheme);
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const shouldAnimate = designerState.animationsEnabled && !prefersReducedMotion;

  const getFontFamily = () => {
    switch (designerState.fontStyle) {
      case 'rounded':
        return "'Comic Sans MS', 'Chalkboard SE', cursive";
      case 'elegant':
        return "'Brush Script MT', 'Lucida Handwriting', cursive";
      case 'modern':
        return "'Helvetica Neue', 'Arial', sans-serif";
      case 'handwritten':
        return "'Courier New', 'Monaco', monospace";
      default:
        return theme.fontFamily;
    }
  };

  const getTextAlign = () => {
    return designerState.textAlignment;
  };

  const getBorderStyle = () => {
    switch (designerState.borderStyle) {
      case 'solid':
        return `4px solid ${theme.borderColor}`;
      case 'decorative':
        return `4px double ${theme.borderColor}`;
      case 'none':
      default:
        return 'none';
    }
  };

  useEffect(() => {
    if (containerRef.current && shouldAnimate) {
      containerRef.current.classList.add('animate-fade-in-up');
    }
  }, [shouldAnimate]);

  return (
    <div ref={containerRef} className="w-full">
      <Card
        className="relative overflow-hidden aspect-[9/16] max-w-md mx-auto"
        style={{
          background: designerState.backgroundStyle === 'gradient' 
            ? (shouldAnimate ? theme.backgroundGradient : theme.backgroundColors[0])
            : 'transparent',
          border: getBorderStyle(),
          boxShadow: shouldAnimate ? `0 0 30px ${theme.glowColor}` : 'none',
        }}
      >
        {/* Glassmorphism overlay */}
        {designerState.backgroundStyle === 'glassmorphism' && (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${theme.backgroundColors[0]}40, ${theme.backgroundColors[1]}40)`,
              backdropFilter: 'blur(20px)',
            }}
          />
        )}

        {/* Animated gradient background */}
        {shouldAnimate && designerState.backgroundStyle === 'gradient' && (
          <div
            className="absolute inset-0 animate-gradient-slow"
            style={{
              background: theme.backgroundGradient,
              backgroundSize: '200% 200%',
            }}
          />
        )}

        {/* Decorative emojis */}
        {designerState.emojiDecorationsEnabled && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {theme.decorativeEmojis.map((emoji, index) => (
              <span
                key={index}
                className={shouldAnimate ? 'animate-float-emoji' : ''}
                style={{
                  position: 'absolute',
                  fontSize: '2rem',
                  opacity: 0.6,
                  left: `${(index * 23 + 10) % 90}%`,
                  top: `${(index * 17 + 5) % 90}%`,
                  animationDelay: `${index * 0.3}s`,
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}

        {/* Photo */}
        {designerState.uploadedPhoto && (
          <div
            className="absolute left-1/2 -translate-x-1/2 w-32 h-32 rounded-full overflow-hidden border-4 z-10"
            style={{
              borderColor: theme.accentColor,
              top: designerState.photoPlacement === 'top' ? '10%' : 
                   designerState.photoPlacement === 'center' ? '50%' : 
                   'auto',
              bottom: designerState.photoPlacement === 'bottom' ? '10%' : 'auto',
              transform: designerState.photoPlacement === 'center' ? 'translate(-50%, -50%)' : 'translateX(-50%)',
            }}
          >
            <img
              src={designerState.uploadedPhoto}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 space-y-6">
          <h2
            className={`text-3xl font-bold ${shouldAnimate ? 'animate-fade-in-up' : ''}`}
            style={{
              color: designerState.fontColor,
              fontFamily: getFontFamily(),
              textAlign: getTextAlign(),
              textShadow: `2px 2px 4px rgba(0,0,0,0.3)`,
            }}
          >
            Happy Birthday {recipientName}!
          </h2>

          <p
            className={`text-lg leading-relaxed ${shouldAnimate ? 'animate-fade-in-up' : ''}`}
            style={{
              color: designerState.fontColor,
              fontFamily: getFontFamily(),
              textAlign: getTextAlign(),
              animationDelay: '0.2s',
              textShadow: `1px 1px 2px rgba(0,0,0,0.3)`,
            }}
          >
            {wishText}
          </p>

          <div
            className={`text-sm opacity-80 ${shouldAnimate ? 'animate-fade-in-up' : ''}`}
            style={{
              color: designerState.fontColor,
              fontFamily: getFontFamily(),
              animationDelay: '0.4s',
            }}
          >
            Made with ❤️ by WishMint AI
          </div>
        </div>
      </Card>
    </div>
  );
}
