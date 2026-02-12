import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import type { CommunityPost, PostId } from '../../../backend';

export function useGetAllCommunityPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<CommunityPost[]>({
    queryKey: ['communityPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCommunityPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCommunityPost(id: PostId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<CommunityPost | null>({
    queryKey: ['communityPost', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getCommunityPost(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}
