import { Button } from '@/components/ui/button';
import { Sparkles, Gift } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { AuthControls } from '../components/AuthControls';

interface HeroSectionProps {
  onGenerateClick: () => void;
  onExamplesClick: () => void;
}

export function HeroSection({ onGenerateClick, onExamplesClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col px-4 py-6 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-background to-neon-green/20 animate-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
      
      {/* Auth controls bar */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex justify-end mb-4">
        <AuthControls />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <Reveal className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30 mb-4">
            <Sparkles className="w-4 h-4 text-neon-purple" />
            <span className="text-sm font-medium text-neon-purple">AI-Powered Birthday Wishes</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-neon-purple via-neon-green to-neon-purple bg-clip-text text-transparent animate-gradient-x">
              WishMint AI
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Make birthdays feel personal in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              onClick={onGenerateClick}
              className="bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold px-8 py-6 text-lg rounded-2xl shadow-neon transition-all hover:scale-105"
            >
              <Gift className="w-5 h-5 mr-2" />
              Generate Wish
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={onExamplesClick}
              className="border-neon-purple/50 hover:bg-neon-purple/10 px-8 py-6 text-lg rounded-2xl"
            >
              See Examples
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
