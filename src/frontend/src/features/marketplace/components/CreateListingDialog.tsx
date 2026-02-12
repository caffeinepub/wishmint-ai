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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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

  const isAuthenticated = !!identity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="listing-type">Content Type</Label>
              <Select value={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
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
              <Label htmlFor="listing-price">Price (₹)</Label>
              <Input
                id="listing-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49"
                min="0"
                required
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
              />
            </div>

            <Alert className="bg-brand-purple/10 border-brand-purple/30">
              <AlertDescription className="text-sm">
                Creating marketplace listings requires a Creator plan.{' '}
                <button
                  type="button"
                  onClick={() => openPricingModal()}
                  className="underline font-semibold hover:text-brand-purple"
                >
                  Upgrade now
                </button>
              </AlertDescription>
            </Alert>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Listing'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
