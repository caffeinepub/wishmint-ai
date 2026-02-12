import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useEntitlements } from '../subscription/useEntitlements';
import { getQuotaRecord, incrementQuota, getRemainingQuota } from './quotaStorage';

export function useMessageQuota() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const { entitlements, effectivePlan } = useEntitlements();
  const queryClient = useQueryClient();

  // For authenticated users, fetch quota from backend
  const backendQuotaQuery = useQuery({
    queryKey: ['messageQuota'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMessageQuotaStatus();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  // Determine remaining quota
  let remaining: number;
  let total: number;

  if (entitlements.dailyMessageLimit === null) {
    // Unlimited
    remaining = 999999;
    total = 999999;
  } else if (isAuthenticated && backendQuotaQuery.data) {
    // Use backend data for authenticated users
    remaining = Number(backendQuotaQuery.data.remaining);
    total = Number(backendQuotaQuery.data.total);
  } else {
    // Use local storage for anonymous users
    total = entitlements.dailyMessageLimit;
    remaining = getRemainingQuota(total);
  }

  const canGenerate = remaining > 0;

  // Mutation to record generation
  const recordMutation = useMutation({
    mutationFn: async () => {
      if (isAuthenticated && actor) {
        // Record on backend for authenticated users
        await actor.recordMessageGeneration();
      } else {
        // Record locally for anonymous users
        incrementQuota();
      }
    },
    onSuccess: () => {
      // Invalidate quota queries
      queryClient.invalidateQueries({ queryKey: ['messageQuota'] });
    },
  });

  return {
    remaining,
    total,
    canGenerate,
    recordGeneration: recordMutation.mutateAsync,
    isLoading: actorFetching || (isAuthenticated && backendQuotaQuery.isLoading),
    effectivePlan,
  };
}
