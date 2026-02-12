import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useGetSurprisePayload } from './useSurpriseLinks';

interface SurpriseViewProps {
  surpriseId: string;
  onBackHome: () => void;
}

// Simple confetti effect using CSS animations
function triggerConfetti() {
  const colors = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    
    // Use percentage-based positioning that stays within viewport
    const leftPosition = Math.random() * 90 + 5; // 5% to 95%
    
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background-color: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${leftPosition}%;
      top: -10px;
      opacity: ${Math.random() * 0.7 + 0.3};
      transform: rotate(${Math.random() * 360}deg);
      animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}

// Add confetti animation styles
if (typeof document !== 'undefined' && !document.getElementById('confetti-styles')) {
  const style = document.createElement('style');
  style.id = 'confetti-styles';
  style.textContent = `
    @keyframes confetti-fall {
      to {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

export function SurpriseView({ surpriseId, onBackHome }: SurpriseViewProps) {
  const { data: payload, isLoading, error } = useGetSurprisePayload(surpriseId);
  const [showName, setShowName] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (payload) {
      // Trigger confetti
      triggerConfetti();
      setTimeout(() => triggerConfetti(), 1000);
      setTimeout(() => triggerConfetti(), 2000);

      // Reveal name after 1s
      setTimeout(() => setShowName(true), 1000);
      // Reveal message after 2.5s
      setTimeout(() => setShowMessage(true), 2500);
    }
  }, [payload]);

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/assets/romantic-music.mp3');
      audioRef.current.loop = true;
    }

    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play().catch((err) => {
        console.error('Audio play failed:', err);
      });
      setIsMusicPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-neon-purple/20 via-background to-neon-green/20">
        <Loader2 className="w-12 h-12 animate-spin text-neon-purple" />
      </div>
    );
  }

  if (error || !payload) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neon-purple/20 via-background to-neon-green/20 px-4">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-3xl font-bold text-destructive">Surprise Not Found</h1>
          <p className="text-muted-foreground">
            This surprise link is invalid, expired, or has been removed.
          </p>
          <Button onClick={onBackHome} className="mt-6">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neon-purple/20 via-background to-neon-green/20 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)] animate-pulse" />

      {/* Music control */}
      <Button
        onClick={toggleMusic}
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 z-10"
      >
        {isMusicPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </Button>

      <div className="relative z-10 w-full max-w-2xl mx-auto text-center space-y-8 px-4">
        {/* Name reveal */}
        <div
          className={`transition-all duration-1000 ${
            showName ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-neon-purple via-neon-green to-neon-purple bg-clip-text text-transparent">
            Happy Birthday
          </h1>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neon-purple mt-4">
            {payload.recipientName}! 🎉
          </h2>
        </div>

        {/* Message fade-in */}
        <div
          className={`transition-all duration-1000 delay-500 ${
            showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-card/60 backdrop-blur-sm border border-neon-purple/30 rounded-2xl p-8 shadow-neon">
            <p className="text-lg sm:text-xl leading-relaxed whitespace-pre-wrap break-words">
              {payload.message}
            </p>
          </div>
        </div>

        {/* Back button */}
        <div
          className={`transition-all duration-1000 delay-1000 ${
            showMessage ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Button
            onClick={onBackHome}
            variant="outline"
            className="border-neon-purple/50 hover:bg-neon-purple/10"
          >
            <Home className="w-4 h-4 mr-2" />
            Create Your Own
          </Button>
        </div>
      </div>
    </div>
  );
}
