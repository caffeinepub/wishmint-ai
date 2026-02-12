import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import type { ListingId } from '../../../backend';

export function useListingInteractionCount(listingId: ListingId) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  return useQuery<bigint>({
    queryKey: ['listingInteractionCount', listingId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getListingInteractionCount(listingId);
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });
}
