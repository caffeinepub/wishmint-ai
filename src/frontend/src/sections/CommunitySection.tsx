import { forwardRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { CommunityPostCard } from '../features/community/components/CommunityPostCard';
import { CommunityPostDetailDialog } from '../features/community/components/CommunityPostDetailDialog';
import { CreateCommunityPostDialog } from '../features/community/components/CreateCommunityPostDialog';
import { useGetAllCommunityPosts } from '../features/community/hooks/useCommunityPosts';
import { useGetFollowedCreators } from '../features/community/hooks/useCreatorFollowState';
import type { CommunityPost } from '../backend';

export const CommunitySection = forwardRef<HTMLDivElement>((props, ref) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'following'>('all');

  const { data: allPosts = [], isLoading } = useGetAllCommunityPosts();
  const followedCreators = useGetFollowedCreators();

  const displayedPosts =
    activeTab === 'following'
      ? allPosts.filter((post) => followedCreators.includes(post.creator.toString()))
      : allPosts;

  const handleViewDetails = (post: CommunityPost) => {
    setSelectedPost(post);
    setDetailDialogOpen(true);
  };

  return (
    <section id="community" ref={ref} className="scroll-mt-16 w-full py-16 px-4 sm:px-6 lg:px-8 section-transition" style={{ backgroundColor: 'oklch(var(--background-secondary))' }}>
      <Reveal className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-brand-purple/30">
            <Users className="w-4 h-4 text-brand-purple" />
            <span className="text-sm font-medium text-brand-purple">Community</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold brand-gradient-text">
            Community Creations
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'oklch(var(--text-body))' }}>
            Share your templates and stickers with the community
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="glass-card">
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={() => setCreateDialogOpen(true)} className="btn-primary-gradient text-white rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p style={{ color: 'oklch(var(--text-body))' }}>Loading posts...</p>
            </div>
          ) : displayedPosts.length === 0 ? (
            <Card className="glass-card border-border/40 rounded-2xl">
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">No posts yet</p>
                <p className="text-sm" style={{ color: 'oklch(var(--text-body))' }}>
                  {activeTab === 'following'
                    ? 'Follow creators to see their posts here'
                    : 'Be the first to share something!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPosts.map((post) => (
                <CommunityPostCard 
                  key={post.id.toString()} 
                  post={post} 
                  onViewDetails={() => handleViewDetails(post)}
                />
              ))}
            </div>
          )}
        </div>
      </Reveal>

      <CreateCommunityPostDialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)} 
      />
      
      {selectedPost && (
        <CommunityPostDetailDialog
          open={detailDialogOpen}
          onClose={() => {
            setDetailDialogOpen(false);
            setSelectedPost(null);
          }}
          post={selectedPost}
        />
      )}
    </section>
  );
});

CommunitySection.displayName = 'CommunitySection';
