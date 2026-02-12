import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

const FOLLOWED_CREATORS_KEY = 'wishmint_followed_creators';

export function useGetFollowedCreators(): string[] {
  const { identity } = useInternetIdentity();
  const [followedCreators, setFollowedCreators] = useState<string[]>([]);

  useEffect(() => {
    if (!identity) {
      setFollowedCreators([]);
      return;
    }

    const principal = identity.getPrincipal().toString();
    const stored = localStorage.getItem(`${FOLLOWED_CREATORS_KEY}_${principal}`);
    if (stored) {
      try {
        setFollowedCreators(JSON.parse(stored));
      } catch {
        setFollowedCreators([]);
      }
    }
  }, [identity]);

  return followedCreators;
}

export function useFollowCreator() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (creatorPrincipal: string) => {
      if (!actor || !identity) throw new Error('Not authenticated');
      
      const principal = identity.getPrincipal().toString();
      const stored = localStorage.getItem(`${FOLLOWED_CREATORS_KEY}_${principal}`);
      const current = stored ? JSON.parse(stored) : [];
      
      if (current.includes(creatorPrincipal)) {
        throw new Error('Already following this creator');
      }

      // Call backend to subscribe
      const { Principal } = await import('@dfinity/principal');
      await actor.subscribeToCreator(Principal.fromText(creatorPrincipal));

      // Update local storage
      const updated = [...current, creatorPrincipal];
      localStorage.setItem(`${FOLLOWED_CREATORS_KEY}_${principal}`, JSON.stringify(updated));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      toast.success('Following creator!');
    },
    onError: (error) => {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('already')) {
        toast.info('Already following this creator');
      } else if (errorMessage.includes('unauthorized') || errorMessage.includes('only users')) {
        toast.error('Please sign in to follow creators');
      } else {
        toast.error('Failed to follow creator. Please try again.');
      }
    },
  });
}

export function useIsFollowingCreator(creatorPrincipal: string): boolean {
  const followedCreators = useGetFollowedCreators();
  return followedCreators.includes(creatorPrincipal);
}
