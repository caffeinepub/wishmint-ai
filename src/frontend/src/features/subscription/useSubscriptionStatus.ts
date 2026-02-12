import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import type { SubscriptionStatus } from '../../backend';

export function useSubscriptionStatus() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const queryClient = useQueryClient();

  const query = useQuery<SubscriptionStatus>({
    queryKey: ['subscriptionStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerSubscriptionStatus();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['subscriptionStatus'] });
  };

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
    refresh,
  };
}
