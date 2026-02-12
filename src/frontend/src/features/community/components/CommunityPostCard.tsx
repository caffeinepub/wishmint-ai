import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, User } from 'lucide-react';
import { useFollowCreator, useIsFollowingCreator } from '../hooks/useCreatorFollowState';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import { formatRelativeTime } from '../../../lib/datetime';
import { shortenPrincipal } from '../../../lib/principal';
import type { CommunityPost } from '../../../backend';

interface CommunityPostCardProps {
  post: CommunityPost;
  onViewDetails: () => void;
}

export function CommunityPostCard({ post, onViewDetails }: CommunityPostCardProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const creatorPrincipal = post.creator.toString();
  const isOwnPost = isAuthenticated && identity.getPrincipal().toString() === creatorPrincipal;
  const isFollowing = useIsFollowingCreator(creatorPrincipal);
  const followMutation = useFollowCreator();

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      return;
    }
    followMutation.mutate(creatorPrincipal);
  };

  const contentTypeLabel = post.contentType.__kind__ === 'template' ? 'Template' : 'Sticker';
  const contentTypeColor = post.contentType.__kind__ === 'template' ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/20' : 'bg-neon-green/10 text-neon-green border-neon-green/20';

  return (
    <Card className="group hover:shadow-card transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50 hover:border-neon-purple/30">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="outline" className={contentTypeColor}>
            {contentTypeLabel}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(Number(post.createdAt))}
          </span>
        </div>
        <CardTitle className="text-lg line-clamp-2 group-hover:text-neon-purple transition-colors">
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {post.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="w-3 h-3" />
          <span className="font-mono">{shortenPrincipal(creatorPrincipal)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewDetails}
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
        {!isOwnPost && (
          <Button
            variant={isFollowing ? 'secondary' : 'default'}
            size="sm"
            onClick={handleFollow}
            disabled={followMutation.isPending || isFollowing}
            className={!isFollowing ? 'bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90' : ''}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
