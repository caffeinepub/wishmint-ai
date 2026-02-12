import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import { toast } from 'sonner';
import { PlanType, ExternalBlob } from '../../../backend';

interface CreatePaymentRequestParams {
  email: string;
  plan: PlanType;
  amount: bigint;
  utr: string;
  screenshot: ExternalBlob | null;
}

export function useCreatePaymentRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreatePaymentRequestParams) => {
      if (!actor) throw new Error('Actor not available');
      
      return actor.createPaymentRequest(
        params.email,
        params.plan,
        params.amount,
        params.utr,
        params.screenshot
      );
    },
    onSuccess: () => {
      toast.success('Payment request submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['userPaymentRequests'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptionStatus'] });
    },
    onError: (error: any) => {
      console.error('Failed to create payment request:', error);
      toast.error(error?.message || 'Failed to submit payment request. Please try again.');
    },
  });
}
