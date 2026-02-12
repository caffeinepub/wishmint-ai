import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import { toast } from 'sonner';
import type { ListingId } from '../../../backend';

interface ExpressInterestParams {
  listingId: ListingId;
  message: string;
}

export function useExpressInterest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: ExpressInterestParams) => {
      if (!actor) throw new Error('Actor not available');
      // Use recordListingInteraction to track buyer interest
      return actor.recordListingInteraction(params.listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplaceListings'] });
      toast.success('Interest recorded!', {
        description: 'The seller has been notified of your interest.',
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to record interest', {
        description: error.message,
      });
    },
  });
}
