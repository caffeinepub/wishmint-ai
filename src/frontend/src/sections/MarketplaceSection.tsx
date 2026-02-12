import { forwardRef, useState } from 'react';
import { Reveal } from '../components/Reveal';
import { MarketplaceListingCard } from '../features/marketplace/components/MarketplaceListingCard';
import { CreateListingDialog } from '../features/marketplace/components/CreateListingDialog';
import { useGetAllMarketplaceListings } from '../features/marketplace/hooks/useMarketplaceListings';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, ShoppingBag, Search } from 'lucide-react';

export const MarketplaceSection = forwardRef<HTMLDivElement>((_, ref) => {
  const { data: listings, isLoading, error } = useGetAllMarketplaceListings();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'template' | 'sticker'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = listings?.filter(listing => {
    const matchesType = typeFilter === 'all' || listing.contentType.__kind__ === typeFilter;
    const matchesSearch = searchQuery === '' || 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  }) || [];

  return (
    <section ref={ref} id="marketplace" className="section-padding bg-background">
      <div className="section-container">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 border border-neon-green/20 mb-4">
              <ShoppingBag className="w-4 h-4 text-neon-green" />
              <span className="text-sm font-medium text-neon-green">Marketplace</span>
            </div>
            <h2 className="section-heading mb-4">
              Buy & Sell{' '}
              <span className="bg-gradient-to-r from-neon-green to-neon-purple bg-clip-text text-transparent">
                Premium Designs
              </span>
            </h2>
            <p className="section-subheading max-w-2xl mx-auto">
              Browse and purchase unique templates and stickers from talented creators. Start selling your own designs today.
            </p>
            <Alert className="mt-6 max-w-2xl mx-auto bg-card/50 border-neon-green/20">
              <AlertDescription className="text-sm">
                <strong>Marketplace MVP:</strong> This is a request-based marketplace. Contact sellers directly to complete purchases.
              </AlertDescription>
            </Alert>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="template">Templates</SelectItem>
                  <SelectItem value="sticker">Stickers</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-neon-green to-neon-purple hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Listing
              </Button>
            </div>
          </div>
        </Reveal>

        {error && (
          <Reveal delay={0.2}>
            <Alert variant="destructive" className="mb-8">
              <AlertDescription>
                Failed to load marketplace listings. Please try again later.
              </AlertDescription>
            </Alert>
          </Reveal>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-neon-green" />
          </div>
        ) : filteredListings.length === 0 ? (
          <Reveal delay={0.2}>
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-green/10 mb-4">
                <ShoppingBag className="w-8 h-8 text-neon-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery || typeFilter !== 'all' ? 'No listings found' : 'No listings yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || typeFilter !== 'all'
                  ? 'Try adjusting your filters or search query.'
                  : 'Be the first to list a template or sticker for sale!'}
              </p>
              {!searchQuery && typeFilter === 'all' && (
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-neon-green to-neon-purple hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Listing
                </Button>
              )}
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing, index) => (
              <Reveal key={listing.id.toString()} delay={0.1 * (index % 3)}>
                <MarketplaceListingCard listing={listing} />
              </Reveal>
            ))}
          </div>
        )}

        <CreateListingDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
        />
      </div>
    </section>
  );
});

MarketplaceSection.displayName = 'MarketplaceSection';
