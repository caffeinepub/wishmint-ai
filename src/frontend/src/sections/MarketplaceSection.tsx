import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Store, Search, Plus } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useGetAllMarketplaceListings } from '../features/marketplace/hooks/useMarketplaceListings';
import { MarketplaceListingCard } from '../features/marketplace/components/MarketplaceListingCard';
import { CreateListingDialog } from '../features/marketplace/components/CreateListingDialog';
import { useAppContext } from '../App';

export function MarketplaceSection() {
  const { data: listings, isLoading } = useGetAllMarketplaceListings();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'template' | 'sticker'>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { openPricingModal } = useAppContext();

  const filteredListings = listings?.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || listing.contentType.__kind__ === filterType;
    return matchesSearch && matchesType;
  }) || [];

  return (
    <section id="marketplace" className="scroll-mt-16 w-full py-16 px-4 sm:px-6 lg:px-8 section-transition" style={{ backgroundColor: 'oklch(var(--background-secondary))' }}>
      <Reveal className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-brand-purple/30">
            <Store className="w-4 h-4 text-brand-purple" />
            <span className="text-sm font-medium text-brand-purple">Creator Marketplace</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold brand-gradient-text">Buy Premium Templates</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'oklch(var(--text-body))' }}>
            Discover and purchase exclusive templates from talented creators
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-card border-border/40"
            />
          </div>
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-full sm:w-48 glass-card border-border/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="template">Templates</SelectItem>
              <SelectItem value="sticker">Stickers</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="premium-button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Listing
          </Button>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading marketplace...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <Card className="glass-card border-border/40">
            <CardContent className="py-12 text-center">
              <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchQuery || filterType !== 'all' 
                  ? 'No listings match your search'
                  : 'No listings available yet. Be the first to create one!'}
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
      </Reveal>

      <CreateListingDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </section>
  );
}
