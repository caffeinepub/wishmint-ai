import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { getEntitlements, type PlanEntitlements } from './plans';
import { PlanType } from '../../backend';

export function useEntitlements() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const subscriptionQuery = useQuery({
    queryKey: ['subscriptionStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerSubscriptionStatus();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  // Determine effective plan
  let effectivePlan: PlanType = PlanType.free;
  if (isAuthenticated && subscriptionQuery.data) {
    effectivePlan = subscriptionQuery.data.plan;
  }

  const entitlements: PlanEntitlements = getEntitlements(effectivePlan);

  return {
    entitlements,
    effectivePlan,
    isLoading: actorFetching || (isAuthenticated && subscriptionQuery.isLoading),
    isAuthenticated,
  };
}
