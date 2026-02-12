import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, User } from 'lucide-react';
import { RequestToBuyDialog } from './RequestToBuyDialog';
import { formatRelativeTime } from '../../../lib/datetime';
import { shortenPrincipal } from '../../../lib/principal';
import type { MarketplaceListing } from '../../../backend';

interface MarketplaceListingCardProps {
  listing: MarketplaceListing;
}

export function MarketplaceListingCard({ listing }: MarketplaceListingCardProps) {
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);

  const contentTypeLabel = listing.contentType.__kind__ === 'template' ? 'Template' : 'Sticker';
  const contentTypeColor = listing.contentType.__kind__ === 'template' ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/20' : 'bg-neon-green/10 text-neon-green border-neon-green/20';

  return (
    <>
      <Card className="group hover:shadow-card transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50 hover:border-neon-green/30">
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge variant="outline" className={contentTypeColor}>
              {contentTypeLabel}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(Number(listing.createdAt))}
            </span>
          </div>
          <CardTitle className="text-lg line-clamp-2 group-hover:text-neon-green transition-colors">
            {listing.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {listing.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span className="font-mono">{shortenPrincipal(listing.creator.toString())}</span>
            </div>
            <div className="text-lg font-bold text-neon-green">
              ${Number(listing.price)}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => setRequestDialogOpen(true)}
            className="w-full bg-gradient-to-r from-neon-green to-neon-purple hover:opacity-90"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Request to Buy
          </Button>
        </CardFooter>
      </Card>

      <RequestToBuyDialog
        listing={listing}
        open={requestDialogOpen}
        onClose={() => setRequestDialogOpen(false)}
      />
    </>
  );
}
