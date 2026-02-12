import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Calendar } from 'lucide-react';
import { useFollowCreator, useIsFollowingCreator } from '../hooks/useCreatorFollowState';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import { formatRelativeTime } from '../../../lib/datetime';
import { shortenPrincipal } from '../../../lib/principal';
import type { CommunityPost } from '../../../backend';

interface CommunityPostDetailDialogProps {
  post: CommunityPost;
  open: boolean;
  onClose: () => void;
}

export function CommunityPostDetailDialog({ post, open, onClose }: CommunityPostDetailDialogProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const creatorPrincipal = post.creator.toString();
  const isOwnPost = isAuthenticated && identity.getPrincipal().toString() === creatorPrincipal;
  const isFollowing = useIsFollowingCreator(creatorPrincipal);
  const followMutation = useFollowCreator();

  const handleFollow = () => {
    if (!isAuthenticated) return;
    followMutation.mutate(creatorPrincipal);
  };

  const contentTypeLabel = post.contentType.__kind__ === 'template' ? 'Template' : 'Sticker';
  const contentTypeColor = post.contentType.__kind__ === 'template' ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/20' : 'bg-neon-green/10 text-neon-green border-neon-green/20';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={contentTypeColor}>
              {contentTypeLabel}
            </Badge>
          </div>
          <DialogTitle className="text-2xl">{post.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Community post details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold mb-2">Description</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">{post.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="font-mono">{shortenPrincipal(creatorPrincipal)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatRelativeTime(Number(post.createdAt))}</span>
            </div>
          </div>

          {!isOwnPost && isAuthenticated && (
            <div className="flex gap-2 pt-4 border-t border-border/50">
              <Button
                onClick={handleFollow}
                disabled={followMutation.isPending || isFollowing}
                className={!isFollowing ? 'bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90' : ''}
                variant={isFollowing ? 'secondary' : 'default'}
              >
                {isFollowing ? 'Following' : 'Follow Creator'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
