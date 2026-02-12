import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import { toast } from 'sonner';
import { PaymentStatus } from '../../../backend';

interface UpdatePaymentStatusParams {
  paymentId: string;
  newStatus: PaymentStatus;
}

export function useUpdatePaymentRequestStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdatePaymentStatusParams) => {
      if (!actor) throw new Error('Actor not available');
      
      return actor.updatePaymentRequestStatus(params.paymentId, params.newStatus);
    },
    onSuccess: (_, variables) => {
      const action = variables.newStatus === PaymentStatus.approved ? 'approved' : 'rejected';
      toast.success(`Payment request ${action} successfully!`);
      queryClient.invalidateQueries({ queryKey: ['allPaymentRequests'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptionStatus'] });
    },
    onError: (error: any) => {
      console.error('Failed to update payment status:', error);
      toast.error(error?.message || 'Failed to update payment status. Please try again.');
    },
  });
}
