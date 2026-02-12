import { useMutation } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';

/**
 * Hook to upsert user auth record after successful Internet Identity login.
 * Creates a new record if none exists, or updates lastLoginAt for existing users.
 */
export function useUserAuthUpsert() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) {
        throw new Error('Actor not available');
      }
      // Provider reflects the actual auth stack: Internet Identity
      await actor.createOrUpdateUserAuth('Internet Identity');
    },
    onError: (error: Error) => {
      console.error('Failed to upsert user auth:', error);
    },
  });
}
