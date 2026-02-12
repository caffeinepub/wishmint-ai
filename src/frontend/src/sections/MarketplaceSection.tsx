import { forwardRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, Plus, Search } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { MarketplaceListingCard } from '../features/marketplace/components/MarketplaceListingCard';
import { CreateListingDialog } from '../features/marketplace/components/CreateListingDialog';
import { useGetAllMarketplaceListings } from '../features/marketplace/hooks/useMarketplaceListings';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const MarketplaceSection = forwardRef<HTMLDivElement>((props, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'template' | 'sticker'>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: listings = [], isLoading } = useGetAllMarketplaceListings();

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === 'all' ||
      (typeFilter === 'template' && listing.contentType.__kind__ === 'template') ||
      (typeFilter === 'sticker' && listing.contentType.__kind__ === 'sticker');

    return matchesSearch && matchesType;
  });

  return (
    <section id="marketplace" ref={ref} className="scroll-mt-16 w-full py-16 px-4 sm:px-6 lg:px-8 section-transition" style={{ backgroundColor: 'oklch(var(--background-secondary))' }}>
      <Reveal className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-brand-purple/30">
            <Store className="w-4 h-4 text-brand-purple" />
            <span className="text-sm font-medium text-brand-purple">Marketplace</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold brand-gradient-text">
            Buy & Sell Templates
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'oklch(var(--text-body))' }}>
            Discover premium templates created by the community
          </p>
        </div>

        <Alert className="mb-8 max-w-3xl mx-auto border-brand-purple/30 glass-card">
          <AlertDescription className="text-center text-sm">
            <strong>MVP Notice:</strong> Marketplace is in beta. Payment processing coming soon. Contact sellers directly for now.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border/40"
              />
            </div>
            <Button onClick={() => setCreateDialogOpen(true)} className="btn-primary-gradient text-white rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Create Listing
            </Button>
          </div>

          <Tabs value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
            <TabsList className="glass-card">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="template">Templates</TabsTrigger>
              <TabsTrigger value="sticker">Stickers</TabsTrigger>
            </TabsList>

            <TabsContent value={typeFilter} className="mt-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <p style={{ color: 'oklch(var(--text-body))' }}>Loading listings...</p>
                </div>
              ) : filteredListings.length === 0 ? (
                <Card className="glass-card border-border/40 rounded-2xl">
                  <CardContent className="py-12 text-center">
                    <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">No listings found</p>
                    <p className="text-sm" style={{ color: 'oklch(var(--text-body))' }}>
                      {searchQuery ? 'Try a different search term' : 'Be the first to create a listing!'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                    <MarketplaceListingCard key={listing.id.toString()} listing={listing} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Reveal>

      <CreateListingDialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)} 
      />
    </section>
  );
});

MarketplaceSection.displayName = 'MarketplaceSection';
