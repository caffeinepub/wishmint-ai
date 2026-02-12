import { useMutation } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import { toast } from 'sonner';
import type { ListingId } from '../../../backend';

interface ExpressInterestParams {
  listingId: ListingId;
  message: string;
}

export function useExpressInterest() {
  const { actor } = useActor();

  return useMutation<void, Error, ExpressInterestParams>({
    mutationFn: async (params) => {
      if (!actor) throw new Error('Actor not available');
      return actor.expressInterest(params.listingId, params.message);
    },
    onSuccess: () => {
      toast.success('Interest recorded! The seller will be notified.');
    },
    onError: (error) => {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('unauthorized') || errorMessage.includes('only users')) {
        toast.info('Sign in to record your interest with the seller');
      } else {
        toast.error('Failed to record interest. Please try again.');
      }
    },
  });
}
