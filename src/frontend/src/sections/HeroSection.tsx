import { Button } from '@/components/ui/button';
import { Sparkles, Gift, Zap } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { AuthControls } from '../components/AuthControls';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface HeroSectionProps {
  onGenerateClick: () => void;
  onTryDemo: () => void;
  onExamplesClick: () => void;
  isAuthenticated: boolean;
  authControlsRef: React.RefObject<HTMLButtonElement | null>;
}

export function HeroSection({
  onGenerateClick,
  onTryDemo,
  onExamplesClick,
  isAuthenticated,
  authControlsRef,
}: HeroSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const showAuthPrompt = !isAuthenticated;

  return (
    <section 
      id="home" 
      className="scroll-mt-16 relative w-full min-h-screen flex flex-col px-4 sm:px-6 lg:px-8 py-6 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom right, #0B0F1A 0%, #111827 50%, #0F172A 100%)'
      }}
    >
      {/* Top bar with creator credit and auth controls */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between mb-4 gap-4">
        <div className="creator-credit">
          Created By <span className="brand-gradient-text font-semibold">Arion Zi</span>
        </div>
        <AuthControls ref={authControlsRef} />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <Reveal className="w-full max-w-4xl mx-auto text-center space-y-8 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-brand-purple/30">
            <Sparkles className="w-4 h-4 text-brand-purple" />
            <span className="text-sm font-medium text-brand-purple">AI-Powered Birthday Wishes</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight">
            <span className="brand-gradient-text">
              WishMint AI
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'oklch(var(--text-subheading))' }}>
            Make birthdays feel personal in seconds.
          </p>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="border-brand-green/50 bg-brand-green/10 text-brand-green px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              3,000+ Wishes Generated Today
            </Badge>
          </div>

          {/* Inline prompts */}
          {showAuthPrompt && (
            <Alert className="max-w-md mx-auto border-brand-purple/30 glass-card">
              <AlertDescription className="text-center text-sm">
                Try the demo or sign in to unlock all features
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            {!isAuthenticated ? (
              <>
                <Button
                  type="button"
                  size="lg"
                  onClick={onTryDemo}
                  className={`btn-primary-gradient text-white font-semibold px-8 py-6 text-base sm:text-lg rounded-full ${
                    prefersReducedMotion ? '' : 'hover:scale-105'
                  } transition-all relative z-20 pointer-events-auto`}
                  style={{ transitionProperty: 'transform, box-shadow' }}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Try Demo
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  size="lg"
                  onClick={onGenerateClick}
                  className={`btn-primary-gradient text-white font-semibold px-8 py-6 text-base sm:text-lg rounded-full ${
                    prefersReducedMotion ? '' : 'hover:scale-105'
                  } transition-all relative z-20 pointer-events-auto`}
                  style={{ transitionProperty: 'transform, box-shadow' }}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Wish
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={onExamplesClick}
                  className={`btn-secondary-gradient px-8 py-6 text-base sm:text-lg rounded-full ${
                    prefersReducedMotion ? '' : 'hover:scale-105'
                  } transition-all relative z-20 pointer-events-auto`}
                  style={{ transitionProperty: 'transform, opacity' }}
                >
                  <Gift className="w-5 h-5 mr-2" />
                  View Examples
                </Button>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
