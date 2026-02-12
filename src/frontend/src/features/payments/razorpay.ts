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

  // Disable Razorpay SDK loading for manual UPI flow
  useEffect(() => {
    // Do not load Razorpay SDK - manual UPI flow is now active
    setRazorpayLoaded(false);
  }, []);

  const initiateUpgrade = async (plan: PlanType): Promise<UpgradeResult> => {
    // Manual UPI flow - this should not be called
    setIsProcessing(false);
    return { success: false, message: 'Manual UPI payment flow is now active' };
  };

  return {
    initiateUpgrade,
    isProcessing,
    razorpayLoaded,
  };
}
