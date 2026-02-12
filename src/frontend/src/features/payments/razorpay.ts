import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PlanType } from '../../backend';
import { PLAN_DEFINITIONS } from '../subscription/plans';

interface UpgradeResult {
  success: boolean;
  message: string;
}

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay?: any;
  }
}

export function useRazorpayUpgrade() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script dynamically
  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      toast.error('Payment system could not be loaded. Please check your internet connection and try again.');
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const initiateUpgrade = async (plan: PlanType): Promise<UpgradeResult> => {
    // Prevent any navigation or external redirects
    if (isProcessing) {
      return { success: false, message: 'Payment is already being processed' };
    }

    setIsProcessing(true);

    try {
      // Check if Razorpay key is configured
      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      
      if (!razorpayKeyId) {
        const errorMessage = 'Payment configuration is missing. Please contact support or configure VITE_RAZORPAY_KEY_ID in your environment.';
        toast.error(errorMessage);
        setIsProcessing(false);
        return { success: false, message: errorMessage };
      }

      // Check if Razorpay SDK is loaded
      if (!razorpayLoaded || !window.Razorpay) {
        const errorMessage = 'Payment system is not ready. Please wait a moment and try again.';
        toast.error(errorMessage);
        setIsProcessing(false);
        return { success: false, message: errorMessage };
      }

      const planDetails = PLAN_DEFINITIONS[plan];
      
      // Create Razorpay options
      const options = {
        key: razorpayKeyId,
        amount: planDetails.priceAmount * 100, // Convert to paise
        currency: 'INR',
        name: 'WishMint AI',
        description: `${planDetails.name} Subscription`,
        image: '/assets/generated/google-g-logo.dim_24x24.png', // Optional: Add your logo
        handler: function (response: any) {
          // Payment successful
          console.log('Payment successful:', response);
          toast.success(`Successfully upgraded to ${planDetails.name}! 🎉`);
          setIsProcessing(false);
          
          // TODO: Verify payment on backend and activate subscription
          // For now, we just show success message
        },
        modal: {
          ondismiss: function () {
            // User closed the payment modal
            toast.info('Payment cancelled. You can try again anytime.');
            setIsProcessing(false);
          },
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#8B5CF6', // neon-purple
        },
      };

      // Open Razorpay checkout (this stays in-app, no navigation)
      const razorpayInstance = new window.Razorpay(options);
      
      razorpayInstance.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description || 'Please try again'}`);
        setIsProcessing(false);
      });

      // Open the checkout modal
      razorpayInstance.open();

      return { success: true, message: 'Payment initiated' };
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      const errorMessage = error?.message || 'Failed to open payment. Please try again.';
      toast.error(errorMessage);
      setIsProcessing(false);
      return { success: false, message: errorMessage };
    }
  };

  return {
    initiateUpgrade,
    isProcessing,
    razorpayLoaded,
  };
}
