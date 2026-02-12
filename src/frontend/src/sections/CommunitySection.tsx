import { forwardRef, useState } from 'react';
import { Reveal } from '../components/Reveal';
import { CommunityPostCard } from '../features/community/components/CommunityPostCard';
import { CommunityPostDetailDialog } from '../features/community/components/CommunityPostDetailDialog';
import { CreateCommunityPostDialog } from '../features/community/components/CreateCommunityPostDialog';
import { useGetAllCommunityPosts } from '../features/community/hooks/useCommunityPosts';
import { useGetFollowedCreators } from '../features/community/hooks/useCreatorFollowState';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, Users, Sparkles } from 'lucide-react';
import type { CommunityPost } from '../backend';

export const CommunitySection = forwardRef<HTMLDivElement>((_, ref) => {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const { data: posts, isLoading, error } = useGetAllCommunityPosts();
  const followedCreators = useGetFollowedCreators();
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'following'>('all');

  const filteredPosts = activeTab === 'following' && isAuthenticated
    ? posts?.filter(post => followedCreators.includes(post.creator.toString())) || []
    : posts || [];

  return (
    <section ref={ref} id="community" className="section-padding bg-card/20">
      <div className="section-container">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/20 mb-4">
              <Users className="w-4 h-4 text-neon-purple" />
              <span className="text-sm font-medium text-neon-purple">Community</span>
            </div>
            <h2 className="section-heading mb-4">
              Share Your{' '}
              <span className="bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
                Templates & Stickers
              </span>
            </h2>
            <p className="section-subheading max-w-2xl mx-auto">
              Discover creative templates and stickers from our community. Share your own designs and build your audience.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'following')} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  All Posts
                </TabsTrigger>
                {isAuthenticated && (
                  <TabsTrigger value="following" className="gap-2">
                    <Users className="w-4 h-4" />
                    Following
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>

            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </div>
        </Reveal>

        {error && (
          <Reveal delay={0.2}>
            <Alert variant="destructive" className="mb-8">
              <AlertDescription>
                Failed to load community posts. Please try again later.
              </AlertDescription>
            </Alert>
          </Reveal>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-neon-purple" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <Reveal delay={0.2}>
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-purple/10 mb-4">
                <Users className="w-8 h-8 text-neon-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {activeTab === 'following' ? 'No posts from followed creators' : 'No posts yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {activeTab === 'following'
                  ? 'Follow creators to see their posts here.'
                  : 'Be the first to share a template or sticker with the community!'}
              </p>
              {activeTab === 'all' && (
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              )}
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <Reveal key={post.id.toString()} delay={0.1 * (index % 3)}>
                <CommunityPostCard
                  post={post}
                  onViewDetails={() => setSelectedPost(post)}
                />
              </Reveal>
            ))}
          </div>
        )}

        {selectedPost && (
          <CommunityPostDetailDialog
            post={selectedPost}
            open={!!selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}

        <CreateCommunityPostDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
        />
      </div>
    </section>
  );
});

CommunitySection.displayName = 'CommunitySection';
