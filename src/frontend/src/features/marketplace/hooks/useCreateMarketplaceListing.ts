import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import { toast } from 'sonner';
import type { ListingId } from '../../../backend';

interface CreateListingParams {
  title: string;
  description: string;
  price: bigint;
  contentType: { __kind__: 'template'; template: bigint } | { __kind__: 'sticker'; sticker: bigint };
}

export function useCreateMarketplaceListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<ListingId, Error, CreateListingParams>({
    mutationFn: async (params) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createMarketplaceListing(params.title, params.description, params.price, params.contentType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplaceListings'] });
      toast.success('Listing created successfully!');
    },
    onError: (error) => {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('unauthorized') || errorMessage.includes('only users')) {
        toast.error('Please sign in to create a listing');
      } else {
        toast.error('Failed to create listing. Please try again.');
      }
    },
  });
}
