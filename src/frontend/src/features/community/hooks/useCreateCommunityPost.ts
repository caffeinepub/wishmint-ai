import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import { toast } from 'sonner';
import type { PostId } from '../../../backend';

interface CreatePostParams {
  title: string;
  description: string;
  contentType: { __kind__: 'template'; template: bigint } | { __kind__: 'sticker'; sticker: bigint };
}

export function useCreateCommunityPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<PostId, Error, CreatePostParams>({
    mutationFn: async (params) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCommunityPost(params.title, params.description, params.contentType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      toast.success('Post created successfully!');
    },
    onError: (error) => {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('unauthorized') || errorMessage.includes('only users')) {
        toast.error('Please sign in to create a post');
      } else {
        toast.error('Failed to create post. Please try again.');
      }
    },
  });
}
