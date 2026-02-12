import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { getEntitlements, type PlanEntitlements } from './plans';
import { PlanType, SubscriptionState } from '../../backend';

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

  // Determine effective plan with expiration check
  let effectivePlan: PlanType = PlanType.free;
  if (isAuthenticated && subscriptionQuery.data) {
    const subscription = subscriptionQuery.data;
    
    // Check if subscription is active and not expired
    if (subscription.state === SubscriptionState.active) {
      if (subscription.expiresAt) {
        const now = Date.now() * 1_000_000; // Convert to nanoseconds
        const expiresAt = Number(subscription.expiresAt);
        
        if (expiresAt > now) {
          effectivePlan = subscription.plan;
        }
      } else {
        // No expiration date means unlimited
        effectivePlan = subscription.plan;
      }
    }
  }

  const entitlements: PlanEntitlements = getEntitlements(effectivePlan);

  return {
    entitlements,
    effectivePlan,
    isLoading: actorFetching || (isAuthenticated && subscriptionQuery.isLoading),
    isAuthenticated,
  };
}
