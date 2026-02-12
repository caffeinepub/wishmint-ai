import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Principal } from '@icp-sdk/core/principal';

/**
 * Hook that calls the backend to verify the authenticated caller's principal.
 * Returns the principal from the backend, or null if anonymous/not authenticated.
 */
export function useWhoAmI() {
  const { actor, isFetching: isActorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Principal | null>({
    queryKey: ['whoami', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      
      try {
        const principal = await actor.testAuthenticatedCaller();
        return principal;
      } catch (error) {
        // If the backend traps (anonymous caller), return null gracefully
        console.log('Backend call failed (likely anonymous):', error);
        return null;
      }
    },
    enabled: !!actor && !isActorFetching,
    staleTime: Infinity,
    retry: false,
  });
}
