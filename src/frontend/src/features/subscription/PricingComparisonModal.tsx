import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Crown, Sparkles, Zap, Heart } from 'lucide-react';
import { PLAN_DEFINITIONS } from './plans';
import { useRazorpayUpgrade } from '../payments/razorpay';
import { PlanType } from '../../backend';

interface PricingComparisonModalProps {
  open: boolean;
  onClose: () => void;
  highlightPlan?: 'pro' | 'creator';
}

export function PricingComparisonModal({ open, onClose, highlightPlan }: PricingComparisonModalProps) {
  const { initiateUpgrade, isProcessing } = useRazorpayUpgrade();

  const handleUpgrade = async (plan: PlanType) => {
    if (plan === PlanType.free) return;
    
    const result = await initiateUpgrade(plan);
    if (result.success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
            Create Something She Will Never Forget 💖
          </DialogTitle>
          <DialogDescription className="text-center text-lg mt-2">
            Choose the perfect plan for your needs
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Free Plan */}
          <div className="border border-border rounded-xl p-6 bg-card/50">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-xl font-bold">{PLAN_DEFINITIONS[PlanType.free].name}</h3>
            </div>
            <div className="text-3xl font-bold mb-2">{PLAN_DEFINITIONS[PlanType.free].price}</div>
            <p className="text-sm text-muted-foreground mb-6">{PLAN_DEFINITIONS[PlanType.free].description}</p>
            <ul className="space-y-3 mb-6">
              {PLAN_DEFINITIONS[PlanType.free].features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </div>

          {/* Pro Plan */}
          <div className={`border rounded-xl p-6 relative ${highlightPlan === 'pro' ? 'border-neon-purple shadow-neon bg-neon-purple/5' : 'border-border bg-card/50'}`}>
            {PLAN_DEFINITIONS[PlanType.pro].popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-neon-purple to-neon-green text-white text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-neon-purple" />
              <h3 className="text-xl font-bold">{PLAN_DEFINITIONS[PlanType.pro].name}</h3>
            </div>
            <div className="text-3xl font-bold mb-2">{PLAN_DEFINITIONS[PlanType.pro].price}</div>
            <p className="text-sm text-muted-foreground mb-6">{PLAN_DEFINITIONS[PlanType.pro].description}</p>
            <ul className="space-y-3 mb-6">
              {PLAN_DEFINITIONS[PlanType.pro].features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-neon-purple mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleUpgrade(PlanType.pro)}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold"
            >
              {isProcessing ? 'Processing...' : 'Upgrade to Pro'}
            </Button>
          </div>

          {/* Creator Plan */}
          <div className={`border rounded-xl p-6 ${highlightPlan === 'creator' ? 'border-neon-green shadow-neon bg-neon-green/5' : 'border-border bg-card/50'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-neon-green" />
              <h3 className="text-xl font-bold">{PLAN_DEFINITIONS[PlanType.creator].name}</h3>
            </div>
            <div className="text-3xl font-bold mb-2">{PLAN_DEFINITIONS[PlanType.creator].price}</div>
            <p className="text-sm text-muted-foreground mb-6">{PLAN_DEFINITIONS[PlanType.creator].description}</p>
            <ul className="space-y-3 mb-6">
              {PLAN_DEFINITIONS[PlanType.creator].features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-neon-green mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleUpgrade(PlanType.creator)}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-neon-green to-neon-purple hover:opacity-90 text-white font-semibold"
            >
              {isProcessing ? 'Processing...' : 'Upgrade to Creator'}
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-neon-purple" />
            Make every birthday unforgettable
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
