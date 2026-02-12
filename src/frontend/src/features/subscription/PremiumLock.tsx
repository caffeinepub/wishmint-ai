import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '../../App';

interface PremiumLockProps {
  feature: string;
}

export function PremiumLock({ feature }: PremiumLockProps) {
  const { openPricingModal } = useAppContext();

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
      <div className="text-center space-y-4 p-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-purple/10 border-2 border-brand-purple/30">
          <Lock className="w-8 h-8 text-brand-purple" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Premium Feature</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Unlock {feature} with a Pro or Creator plan
          </p>
        </div>
        <Button
          onClick={() => openPricingModal()}
          className="premium-button"
        >
          Unlock Premium
        </Button>
      </div>
    </div>
  );
}
