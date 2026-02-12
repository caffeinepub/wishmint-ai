import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DownloadRecord, SavedTemplate, CreatorEarnings } from '../backend';

export function useGetCallerDownloadHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DownloadRecord[]>({
    queryKey: ['downloadHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerDownloadHistory();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetCallerSavedTemplates() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SavedTemplate[]>({
    queryKey: ['savedTemplates'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerSavedTemplates();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetCreatorEarnings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CreatorEarnings | null>({
    queryKey: ['creatorEarnings'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCreatorEarnings();
      } catch (error) {
        // User might not have creator plan
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useRecordDownload() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contentType, contentId }: { contentType: string; contentId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordDownload(contentType, contentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['downloadHistory'] });
    },
  });
}

export function useSaveTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveTemplate(templateId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedTemplates'] });
    },
  });
}
