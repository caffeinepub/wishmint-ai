import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Crown, Sparkles, Zap, ArrowLeft, CreditCard } from 'lucide-react';
import { PLAN_DEFINITIONS } from './plans';
import { useRazorpayUpgrade } from '../payments/razorpay';
import { PlanType } from '../../backend';

interface PricingComparisonModalProps {
  open: boolean;
  onClose: () => void;
  highlightPlan?: 'pro' | 'creator';
}

type ModalStep = 'comparison' | 'confirmation';

export function PricingComparisonModal({ open, onClose, highlightPlan }: PricingComparisonModalProps) {
  const { initiateUpgrade, isProcessing } = useRazorpayUpgrade();
  const [step, setStep] = useState<ModalStep>('comparison');
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

  // Reset to comparison view when modal opens/closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setStep('comparison');
      setSelectedPlan(null);
      onClose();
    }
  };

  const handleSelectPlan = (plan: PlanType) => {
    if (plan === PlanType.free) return;
    
    console.log('Plan selected for upgrade:', plan);
    setSelectedPlan(plan);
    setStep('confirmation');
  };

  const handleBackToComparison = () => {
    setStep('comparison');
    setSelectedPlan(null);
  };

  const handleProceedToPayment = async () => {
    if (!selectedPlan) return;
    
    console.log('Proceeding to payment for:', selectedPlan);
    
    const result = await initiateUpgrade(selectedPlan);
    if (result.success) {
      // Reset and close modal on success
      setStep('comparison');
      setSelectedPlan(null);
      onClose();
    }
    // On failure, stay in modal so user can try again or cancel
  };

  const getPlanDetails = (plan: PlanType) => {
    const planDef = PLAN_DEFINITIONS[plan];
    return {
      name: planDef.name,
      price: planDef.price,
      priceAmount: planDef.priceAmount,
      features: planDef.features,
    };
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        {step === 'comparison' ? (
          <>
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
              <div className={`border rounded-lg p-6 ${highlightPlan === undefined ? 'border-neon-purple/50' : 'border-border'}`}>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neon-purple/10 mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-neon-purple" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">Free</h3>
                <p className="text-center text-3xl font-bold mb-4">₹0</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                    <span className="text-sm">3 wishes per day</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Watermark</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Limited templates</span>
                  </li>
                </ul>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  Current Plan
                </Button>
              </div>

              {/* Pro Plan */}
              <div className={`border rounded-lg p-6 relative ${highlightPlan === 'pro' ? 'border-neon-purple ring-2 ring-neon-purple' : 'border-border'}`}>
                {highlightPlan === 'pro' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-neon-purple to-neon-green text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Recommended
                  </div>
                )}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neon-purple/10 mx-auto mb-4">
                  <Zap className="w-6 h-6 text-neon-purple" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">Pro</h3>
                <p className="text-center text-3xl font-bold mb-4">₹49<span className="text-base font-normal text-muted-foreground">/month</span></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Unlimited wishes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Remove watermark</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                    <span className="text-sm">HD download</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Premium templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Surprise mode</span>
                  </li>
                </ul>
                <Button
                  type="button"
                  onClick={() => handleSelectPlan(PlanType.pro)}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold relative z-20 pointer-events-auto"
                >
                  Select Pro
                </Button>
              </div>

              {/* Creator Plan */}
              <div className={`border rounded-lg p-6 relative ${highlightPlan === 'creator' ? 'border-neon-purple ring-2 ring-neon-purple' : 'border-border'}`}>
                {highlightPlan === 'creator' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-neon-purple to-neon-green text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Recommended
                  </div>
                )}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neon-purple/10 mx-auto mb-4">
                  <Crown className="w-6 h-6 text-neon-purple" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">Creator</h3>
                <p className="text-center text-3xl font-bold mb-4">₹149<span className="text-base font-normal text-muted-foreground">/month</span></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Sell templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Voice wishes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Reel export</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Marketplace access</span>
                  </li>
                </ul>
                <Button
                  type="button"
                  onClick={() => handleSelectPlan(PlanType.creator)}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold relative z-20 pointer-events-auto"
                >
                  Select Creator
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Confirm Your Upgrade
              </DialogTitle>
              <DialogDescription className="text-center text-base mt-2">
                Review your selection before proceeding to payment
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 max-w-md mx-auto">
              {selectedPlan && (
                <div className="border rounded-lg p-6 bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{getPlanDetails(selectedPlan).name}</h3>
                    <div className="text-2xl font-bold text-neon-purple">
                      ₹{getPlanDetails(selectedPlan).priceAmount}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-muted-foreground font-semibold">What you'll get:</p>
                    <ul className="space-y-2">
                      {getPlanDetails(selectedPlan).features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <p className="text-xs text-muted-foreground text-center">
                      You will be redirected to Razorpay to complete your payment securely.
                      Your subscription will be activated immediately after successful payment.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBackToComparison}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleProceedToPayment}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
