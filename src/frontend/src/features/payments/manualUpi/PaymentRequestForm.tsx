import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, AlertCircle } from 'lucide-react';
import { PlanType } from '../../../backend';
import { getStoredPaymentEmail, setStoredPaymentEmail } from './paymentEmailStorage';
import { useCreatePaymentRequest } from '../hooks/useCreatePaymentRequest';
import { ExternalBlob } from '../../../backend';

interface PaymentRequestFormProps {
  plan: PlanType;
  amount: number;
  onSuccess: () => void;
  onBack: () => void;
}

export function PaymentRequestForm({ plan, amount, onSuccess, onBack }: PaymentRequestFormProps) {
  const [email, setEmail] = useState('');
  const [utr, setUtr] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ email?: string; utr?: string }>({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const { mutate: createPaymentRequest, isPending } = useCreatePaymentRequest();
  const planName = plan === PlanType.pro ? 'Pro' : 'Creator';

  useEffect(() => {
    const storedEmail = getStoredPaymentEmail();
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors });
        alert('Screenshot must be less than 5MB');
        return;
      }
      setScreenshot(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; utr?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!utr.trim()) {
      newErrors.utr = 'UTR/Transaction ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Store email for future use
    setStoredPaymentEmail(email);

    // Convert screenshot to ExternalBlob if provided
    let screenshotBlob: ExternalBlob | null = null;
    if (screenshot) {
      const arrayBuffer = await screenshot.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      screenshotBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });
    }

    createPaymentRequest(
      {
        email: email.trim(),
        plan,
        amount: BigInt(amount),
        utr: utr.trim(),
        screenshot: screenshotBlob,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plan Summary (Read-only) */}
      <Card className="p-4 bg-muted/50">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Plan</p>
            <p className="font-semibold">{planName}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Amount</p>
            <p className="font-semibold">₹{amount}</p>
          </div>
        </div>
      </Card>

      {/* Helper Text */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm space-y-1">
          <p>Enter <strong>UTR/Transaction ID</strong> after payment (required)</p>
          <p>Approval time: 5–60 minutes</p>
        </AlertDescription>
      </Alert>

      {/* Email Input */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          placeholder="your@email.com"
          disabled={isPending}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      {/* UTR Input */}
      <div className="space-y-2">
        <Label htmlFor="utr">UTR / Transaction ID *</Label>
        <Input
          id="utr"
          type="text"
          value={utr}
          onChange={(e) => {
            setUtr(e.target.value);
            if (errors.utr) setErrors({ ...errors, utr: undefined });
          }}
          placeholder="Enter 12-digit UTR number"
          disabled={isPending}
          className={errors.utr ? 'border-destructive' : ''}
        />
        {errors.utr && (
          <p className="text-sm text-destructive">{errors.utr}</p>
        )}
      </div>

      {/* Screenshot Upload (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="screenshot">Payment Screenshot (Optional but recommended)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="screenshot"
            type="file"
            accept="image/*"
            onChange={handleScreenshotChange}
            disabled={isPending}
            className="flex-1"
          />
          {screenshot && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Upload className="w-4 h-4" />
              {screenshot.name}
            </span>
          )}
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <p className="text-sm text-muted-foreground">Uploading: {uploadProgress}%</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isPending}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Payment Request'
          )}
        </Button>
      </div>
    </form>
  );
}
