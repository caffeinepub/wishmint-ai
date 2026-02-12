import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateMarketplaceListing } from '../hooks/useCreateMarketplaceListing';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import { useAppContext } from '../../../App';
import { useEntitlements } from '../../subscription/useEntitlements';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Crown } from 'lucide-react';

interface CreateListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ContentType = 'template' | 'sticker';

export function CreateListingDialog({ open, onOpenChange }: CreateListingDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [contentType, setContentType] = useState<ContentType>('template');
  const [contentId, setContentId] = useState('1');

  const { mutate: createListing, isPending } = useCreateMarketplaceListing();
  const { identity } = useInternetIdentity();
  const { openPricingModal } = useAppContext();
  const { entitlements, isLoading: entitlementsLoading } = useEntitlements();

  const isAuthenticated = !!identity;
  const canCreateListings = entitlements.creatorMarketplace;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      return;
    }

    if (!canCreateListings) {
      return;
    }

    const priceNum = parseInt(price, 10);
    if (isNaN(priceNum) || priceNum < 0) {
      alert('Please enter a valid price');
      return;
    }

    const contentIdNum = BigInt(contentId);

    createListing(
      {
        title,
        description,
        price: BigInt(priceNum),
        contentType:
          contentType === 'template'
            ? { __kind__: 'template', template: contentIdNum }
            : { __kind__: 'sticker', sticker: contentIdNum },
      },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setPrice('');
          setContentType('template');
          setContentId('1');
          onOpenChange(false);
        },
      }
    );
  };

  const handleUpgrade = () => {
    openPricingModal({ highlightPlan: 'creator' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Marketplace Listing</DialogTitle>
          <DialogDescription>
            Share your templates and stickers with the community
          </DialogDescription>
        </DialogHeader>

        {!isAuthenticated ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please sign in to create marketplace listings
            </AlertDescription>
          </Alert>
        ) : !canCreateListings && !entitlementsLoading ? (
          <Alert className="border-neon-purple/30 bg-gradient-to-r from-neon-purple/5 to-neon-green/5">
            <Crown className="h-5 w-5 text-neon-purple" />
            <AlertDescription>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-foreground mb-1">Creator Plan Required</p>
                  <p className="text-sm text-muted-foreground">
                    Upgrade to the Creator plan to sell your templates and stickers in the marketplace
                  </p>
                </div>
                <Button
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Creator
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="listing-title">Title</Label>
              <Input
                id="listing-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Elegant Birthday Template"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="listing-type">Content Type</Label>
              <Select value={contentType} onValueChange={(value) => setContentType(value as ContentType)} disabled={isPending}>
                <SelectTrigger id="listing-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="template">Template</SelectItem>
                  <SelectItem value="sticker">Sticker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="listing-price">Price ($)</Label>
              <Input
                id="listing-price"
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 5"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="listing-description">Description</Label>
              <Textarea
                id="listing-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your template or sticker..."
                rows={4}
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-id">Content ID</Label>
              <Input
                id="content-id"
                type="number"
                min="1"
                value={contentId}
                onChange={(e) => setContentId(e.target.value)}
                placeholder="1"
                required
                disabled={isPending}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="premium-button">
                {isPending ? 'Creating...' : 'Create Listing'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
