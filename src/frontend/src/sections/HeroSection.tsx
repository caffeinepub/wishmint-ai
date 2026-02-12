import { Button } from '@/components/ui/button';
import { Sparkles, Gift, Zap } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { AuthControls } from '../components/AuthControls';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { AuthEntryDialog } from '../components/auth/AuthEntryDialog';

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
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const showAuthPrompt = !isAuthenticated;

  const handleAuthSuccess = () => {
    // Scroll to generator after successful auth
    setTimeout(() => {
      onGenerateClick();
    }, 300);
  };

  return (
    <>
      <section className="relative w-full min-h-screen flex flex-col px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/15 via-background to-neon-green/15 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.08),transparent_50%)]" />
        
        {/* Top bar with creator credit and auth controls */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between mb-4 gap-4">
          <div className="creator-credit">
            Created By <span className="text-neon-purple">Arion Zi</span>
          </div>
          <AuthControls ref={authControlsRef} />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <Reveal className="w-full max-w-4xl mx-auto text-center space-y-8 px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30 mb-4">
              <Sparkles className="w-4 h-4 text-neon-purple" />
              <span className="text-sm font-medium text-neon-purple">AI-Powered Birthday Wishes</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-neon-purple via-neon-green to-neon-purple bg-clip-text text-transparent animate-gradient-x">
                WishMint AI
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Make birthdays feel personal in seconds.
            </p>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="border-neon-green/50 bg-neon-green/10 text-neon-green px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                3,000+ Wishes Generated Today
              </Badge>
            </div>

            {/* Inline prompts */}
            {showAuthPrompt && (
              <Alert className="max-w-md mx-auto border-neon-purple/30 bg-neon-purple/5">
                <AlertDescription className="text-center text-sm">
                  Try the demo or sign in to unlock all features
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              {!isAuthenticated ? (
                <>
                  <Button
                    size="lg"
                    onClick={onTryDemo}
                    className="bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold px-8 py-6 text-base sm:text-lg rounded-xl shadow-neon transition-all hover:scale-105"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Try Demo
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setAuthDialogOpen(true)}
                    className="border-neon-purple/50 hover:bg-neon-purple/10 px-8 py-6 text-base sm:text-lg rounded-xl transition-all hover:scale-105"
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={onGenerateClick}
                    className="bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold px-8 py-6 text-base sm:text-lg rounded-xl shadow-neon transition-all hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Wish
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={onExamplesClick}
                    className="border-neon-purple/50 hover:bg-neon-purple/10 px-8 py-6 text-base sm:text-lg rounded-xl transition-all hover:scale-105"
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

      <AuthEntryDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}
