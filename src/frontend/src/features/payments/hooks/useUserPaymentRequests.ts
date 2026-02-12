import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import type { PaymentRequest } from '../../../backend';

export function useUserPaymentRequests() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  return useQuery<PaymentRequest[]>({
    queryKey: ['userPaymentRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserPaymentRequests();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });
}
