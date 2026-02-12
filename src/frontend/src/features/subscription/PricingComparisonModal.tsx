import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Crown, Sparkles, Zap, ArrowLeft, RefreshCw } from 'lucide-react';
import { PLAN_DEFINITIONS } from './plans';
import { PlanType, PaymentStatus } from '../../backend';
import { ManualUpiPaymentStep } from '../payments/manualUpi/ManualUpiPaymentStep';
import { PaymentRequestForm } from '../payments/manualUpi/PaymentRequestForm';
import { useUserPaymentRequests } from '../payments/hooks/useUserPaymentRequests';
import { useSubscriptionStatus } from './useSubscriptionStatus';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface PricingComparisonModalProps {
  open: boolean;
  onClose: () => void;
  highlightPlan?: 'pro' | 'creator';
}

type ModalStep = 'comparison' | 'payment' | 'submitUtr' | 'pendingVerification';

export function PricingComparisonModal({ open, onClose, highlightPlan }: PricingComparisonModalProps) {
  const [step, setStep] = useState<ModalStep>('comparison');
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const { data: paymentRequests, refetch: refetchPayments } = useUserPaymentRequests();
  const { refetch: refetchSubscription } = useSubscriptionStatus();

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
    setStep('payment');
  };

  const handleBackToComparison = () => {
    setStep('comparison');
    setSelectedPlan(null);
  };

  const handlePaymentNext = () => {
    setStep('submitUtr');
  };

  const handlePaymentBack = () => {
    setStep('payment');
  };

  const handleSubmitSuccess = () => {
    setStep('pendingVerification');
  };

  const handleSubmitBack = () => {
    setStep('payment');
  };

  const handleRefreshStatus = async () => {
    await refetchPayments();
    await refetchSubscription();
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

  const latestRequest = paymentRequests?.[0];

  const getStatusBadge = (status: PaymentStatus) => {
    if (status === PaymentStatus.pending) {
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    }
    if (status === PaymentStatus.approved) {
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
        <XCircle className="w-3 h-3 mr-1" />
        Rejected
      </Badge>
    );
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
                    <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                    <span className="text-sm">3 wishes per day</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                    <span className="text-sm">Watermark</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
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
                    <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                    <span className="text-sm">Unlimited wishes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                    <span className="text-sm">Remove watermark</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                    <span className="text-sm">HD download</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                    <span className="text-sm">Premium templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                    <span className="text-sm">Surprise mode</span>
                  </li>
                </ul>
                <Button
                  type="button"
                  onClick={() => handleSelectPlan(PlanType.pro)}
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
                    <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                    <span className="text-sm">Sell templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                    <span className="text-sm">Voice wishes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                    <span className="text-sm">Reel export</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                    <span className="text-sm">Marketplace access</span>
                  </li>
                </ul>
                <Button
                  type="button"
                  onClick={() => handleSelectPlan(PlanType.creator)}
                  className="w-full bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold relative z-20 pointer-events-auto"
                >
                  Select Creator
                </Button>
              </div>
            </div>
          </>
        ) : step === 'payment' && selectedPlan ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Complete Your Payment
              </DialogTitle>
              <DialogDescription className="text-center text-base mt-2">
                Pay via UPI to unlock premium features
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 max-w-md mx-auto">
              <ManualUpiPaymentStep
                plan={selectedPlan}
                amount={getPlanDetails(selectedPlan).priceAmount}
                onNext={handlePaymentNext}
                onBack={handleBackToComparison}
              />
            </div>
          </>
        ) : step === 'submitUtr' && selectedPlan ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Submit Payment Details
              </DialogTitle>
              <DialogDescription className="text-center text-base mt-2">
                Enter your transaction details for verification
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 max-w-md mx-auto">
              <PaymentRequestForm
                plan={selectedPlan}
                amount={getPlanDetails(selectedPlan).priceAmount}
                onSuccess={handleSubmitSuccess}
                onBack={handleSubmitBack}
              />
            </div>
          </>
        ) : step === 'pendingVerification' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Payment Request Submitted
              </DialogTitle>
              <DialogDescription className="text-center text-base mt-2">
                Your payment is being verified
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 max-w-md mx-auto space-y-6">
              <Alert className="bg-yellow-500/10 border-yellow-500/30">
                <Clock className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-600">
                  <p className="font-semibold mb-1">Pending verification</p>
                  <p className="text-sm">Your payment request is under review. You will receive premium access within 5–60 minutes after approval.</p>
                </AlertDescription>
              </Alert>

              {latestRequest && (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {getStatusBadge(latestRequest.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Plan</span>
                    <span className="font-semibold">{latestRequest.plan === PlanType.pro ? 'Pro' : 'Creator'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="font-semibold">₹{Number(latestRequest.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">UTR</span>
                    <span className="font-mono text-xs">{latestRequest.utr}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRefreshStatus}
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Status
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setStep('comparison');
                    setSelectedPlan(null);
                  }}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
