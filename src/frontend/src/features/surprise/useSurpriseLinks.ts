import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { toast } from 'sonner';
import type { SurprisePayload } from '../../backend';

export function useCreateSurpriseLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recipientName, message }: { recipientName: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      const surpriseId = await actor.createSurpriseLink(recipientName, message);
      return surpriseId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surpriseLinks'] });
      toast.success('Surprise link created!');
    },
    onError: (error: Error) => {
      if (error.message.includes('Pro or Creator')) {
        toast.error('Premium Feature', {
          description: 'Surprise Mode requires Pro or Creator plan.',
        });
      } else {
        toast.error('Failed to create surprise link', {
          description: error.message,
        });
      }
    },
  });
}

export function useGetSurprisePayload(surpriseId: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SurprisePayload | null>({
    queryKey: ['surprisePayload', surpriseId],
    queryFn: async () => {
      if (!actor || !surpriseId) return null;
      return actor.getSurprisePayload(surpriseId);
    },
    enabled: !!actor && !actorFetching && !!surpriseId,
    retry: false,
  });
}
