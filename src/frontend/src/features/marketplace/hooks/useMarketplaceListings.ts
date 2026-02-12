import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import type { MarketplaceListing, ListingId } from '../../../backend';

export function useGetAllMarketplaceListings() {
  const { actor, isFetching } = useActor();

  return useQuery<MarketplaceListing[]>({
    queryKey: ['marketplaceListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMarketplaceListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMarketplaceListing(id: ListingId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<MarketplaceListing | null>({
    queryKey: ['marketplaceListing', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getMarketplaceListing(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}
