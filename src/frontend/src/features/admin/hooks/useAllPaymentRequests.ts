import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import type { PaymentRequest } from '../../../backend';

export function useAllPaymentRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PaymentRequest[]>({
    queryKey: ['allPaymentRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllPaymentRequests();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
