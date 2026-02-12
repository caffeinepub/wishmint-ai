import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, User, Lock, Crown } from 'lucide-react';
import { RequestToBuyDialog } from './RequestToBuyDialog';
import { formatRelativeTime } from '../../../lib/datetime';
import { shortenPrincipal } from '../../../lib/principal';
import type { MarketplaceListing } from '../../../backend';

interface MarketplaceListingCardProps {
  listing: MarketplaceListing;
  isLocked?: boolean;
  onUpgrade?: () => void;
}

export function MarketplaceListingCard({ listing, isLocked = false, onUpgrade }: MarketplaceListingCardProps) {
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);

  const contentTypeLabel = listing.contentType.__kind__ === 'template' ? 'Template' : 'Sticker';
  const contentTypeColor = listing.contentType.__kind__ === 'template' ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/20' : 'bg-neon-green/10 text-neon-green border-neon-green/20';

  const handlePrimaryAction = () => {
    if (isLocked) {
      return; // Do nothing - upgrade button handles this
    }
    setRequestDialogOpen(true);
  };

  return (
    <>
      <Card className={`group transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50 ${
        isLocked 
          ? 'opacity-75' 
          : 'hover:shadow-card hover:border-neon-green/30'
      }`}>
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={contentTypeColor}>
                {contentTypeLabel}
              </Badge>
              {isLocked && (
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                  <Lock className="w-3 h-3 mr-1" />
                  Locked
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(Number(listing.createdAt))}
            </span>
          </div>
          <CardTitle className={`text-lg line-clamp-2 transition-colors ${
            isLocked ? 'text-muted-foreground' : 'group-hover:text-neon-green'
          }`}>
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
            <div className={`text-lg font-bold ${isLocked ? 'text-muted-foreground' : 'text-neon-green'}`}>
              ${Number(listing.price)}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {isLocked ? (
            <>
              <Button
                disabled
                className="w-full bg-muted text-muted-foreground cursor-not-allowed"
              >
                <Lock className="w-4 h-4 mr-2" />
                Purchase Locked
              </Button>
              <Button
                onClick={onUpgrade}
                className="w-full bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Unlock
              </Button>
            </>
          ) : (
            <Button
              onClick={handlePrimaryAction}
              className="w-full bg-gradient-to-r from-neon-green to-neon-purple hover:opacity-90"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Request to Buy
            </Button>
          )}
        </CardFooter>
      </Card>

      {!isLocked && (
        <RequestToBuyDialog
          listing={listing}
          open={requestDialogOpen}
          onClose={() => setRequestDialogOpen(false)}
        />
      )}
    </>
  );
}
