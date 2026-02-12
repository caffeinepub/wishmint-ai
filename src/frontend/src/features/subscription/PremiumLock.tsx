import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useAppContext } from '../../App';

interface PremiumLockProps {
  children: ReactNode;
  isLocked: boolean;
  feature?: string;
  requiredPlan?: 'pro' | 'creator';
}

export function PremiumLock({ children, isLocked, feature, requiredPlan }: PremiumLockProps) {
  const { openPricingModal } = useAppContext();

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm opacity-50">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Button
          onClick={() => openPricingModal(requiredPlan)}
          className="bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold shadow-neon"
        >
          <Lock className="w-4 h-4 mr-2" />
          Unlock Premium
        </Button>
      </div>
    </div>
  );
}
