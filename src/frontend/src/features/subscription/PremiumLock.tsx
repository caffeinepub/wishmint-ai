import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useAppContext } from '../../App';

interface PremiumLockProps {
  feature?: string;
}

export function PremiumLock({ feature = 'This feature' }: PremiumLockProps) {
  const { openPricingModal } = useAppContext();

  const handleUnlock = () => {
    console.log('Premium lock unlock clicked');
    openPricingModal('pro');
  };

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
      <div className="text-center space-y-4 p-6">
        <div className="w-16 h-16 rounded-full bg-neon-purple/10 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-neon-purple" />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">{feature} is Premium</h3>
          <p className="text-muted-foreground text-sm">
            Upgrade to Pro or Creator plan to unlock this feature
          </p>
        </div>
        <Button
          type="button"
          onClick={handleUnlock}
          className="bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold relative z-20 pointer-events-auto"
        >
          Unlock Premium
        </Button>
      </div>
    </div>
  );
}
