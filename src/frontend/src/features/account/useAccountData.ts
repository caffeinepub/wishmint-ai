import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import type { DownloadRecord, SavedTemplate, CreatorEarnings } from '../../backend';

export function useDownloadHistory() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  return useQuery<DownloadRecord[]>({
    queryKey: ['downloadHistory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerDownloadHistory();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });
}

export function useSavedTemplates() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  return useQuery<SavedTemplate[]>({
    queryKey: ['savedTemplates'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerSavedTemplates();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });
}

export function useCreatorEarnings() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  return useQuery<CreatorEarnings>({
    queryKey: ['creatorEarnings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCreatorEarnings();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });
}
