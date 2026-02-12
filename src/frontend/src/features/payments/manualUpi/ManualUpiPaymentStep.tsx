import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, ExternalLink, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { PlanType } from '../../../backend';
import { UPI_ID, PAYEE_NAME, QR_IMAGE_PATH } from './constants';
import { generateUpiDeepLink } from './upiDeepLink';
import { copyToClipboard } from '../../../lib/clipboard';

interface ManualUpiPaymentStepProps {
  plan: PlanType;
  amount: number;
  onNext: () => void;
  onBack: () => void;
}

export function ManualUpiPaymentStep({ plan, amount, onNext, onBack }: ManualUpiPaymentStepProps) {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const upiDeepLink = generateUpiDeepLink(plan, amount);
  const planName = plan === PlanType.pro ? 'Pro' : 'Creator';

  const handleCopyUpi = async () => {
    await copyToClipboard(UPI_ID);
    setCopiedUpi(true);
    toast.success('UPI ID copied to clipboard');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleOpenUpiApps = () => {
    try {
      window.location.href = upiDeepLink;
    } catch (error) {
      toast.info('Please use the QR code or UPI ID to make payment');
    }
  };

  return (
    <div className="space-y-6">
      {/* Plan Summary */}
      <Card className="p-4 bg-gradient-to-r from-neon-purple/10 to-neon-green/10 border-neon-purple/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{planName} Plan</h3>
            <p className="text-sm text-muted-foreground">30 days premium access</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-neon-purple">₹{amount}</p>
          </div>
        </div>
      </Card>

      {/* Step Instructions */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple font-bold">
            1
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-1">Scan QR / pay to UPI ID</h4>
            <p className="text-sm text-muted-foreground">Use any UPI app to complete payment</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple font-bold">
            2
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-1">Enter UTR</h4>
            <p className="text-sm text-muted-foreground">Submit transaction ID after payment</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple font-bold">
            3
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-1">Get premium unlocked</h4>
            <p className="text-sm text-muted-foreground">Approval time: 5–60 minutes</p>
          </div>
        </div>
      </div>

      {/* QR Code */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h4 className="font-semibold">Scan QR Code</h4>
          <div className="flex justify-center">
            <div className="w-full max-w-[280px] aspect-square">
              <img
                src={QR_IMAGE_PATH}
                alt="UPI QR code for payment"
                className="w-full h-full object-contain rounded-lg border-2 border-border"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Scan with any UPI app to pay ₹{amount}
          </p>
        </div>
      </Card>

      {/* UPI Details */}
      <Card className="p-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Pay to</p>
            <p className="font-semibold">{PAYEE_NAME}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">UPI ID</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono">
                {UPI_ID}
              </code>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCopyUpi}
                className="shrink-0"
              >
                {copiedUpi ? (
                  <CheckCircle2 className="w-4 h-4 text-neon-green" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          type="button"
          onClick={handleOpenUpiApps}
          className="w-full bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open UPI Apps
        </Button>
        
        <Button
          type="button"
          onClick={onNext}
          variant="outline"
          className="w-full"
        >
          I've Made the Payment
        </Button>

        <Button
          type="button"
          onClick={onBack}
          variant="ghost"
          className="w-full"
        >
          Back to Plans
        </Button>
      </div>
    </div>
  );
}
