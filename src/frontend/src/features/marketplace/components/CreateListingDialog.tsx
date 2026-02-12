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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Crown } from 'lucide-react';
import { useCreateMarketplaceListing } from '../hooks/useCreateMarketplaceListing';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import { useEntitlements } from '../../subscription/useEntitlements';
import { useAppContext } from '../../../App';

interface CreateListingDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateListingDialog({ open, onClose }: CreateListingDialogProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const { entitlements } = useEntitlements();
  const { openPricingModal } = useAppContext();
  const createMutation = useCreateMarketplaceListing();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [contentType, setContentType] = useState<'template' | 'sticker'>('template');

  const canCreateListing = isAuthenticated && entitlements.creatorMarketplace;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateListing) return;

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return;
    }

    const contentTypeParam = contentType === 'template'
      ? { __kind__: 'template' as const, template: BigInt(1) }
      : { __kind__: 'sticker' as const, sticker: BigInt(1) };

    createMutation.mutate(
      { title, description, price: BigInt(Math.floor(priceNum)), contentType: contentTypeParam },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setPrice('');
          setContentType('template');
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      setTitle('');
      setDescription('');
      setPrice('');
      setContentType('template');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Marketplace Listing</DialogTitle>
          <DialogDescription>
            List your template or sticker for sale
          </DialogDescription>
        </DialogHeader>

        {!isAuthenticated ? (
          <Alert className="bg-neon-green/10 border-neon-green/20">
            <AlertCircle className="h-4 w-4 text-neon-green" />
            <AlertDescription className="text-sm">
              Please sign in to create a listing and start selling your designs.
            </AlertDescription>
          </Alert>
        ) : !canCreateListing ? (
          <Alert className="bg-neon-purple/10 border-neon-purple/20">
            <Crown className="h-4 w-4 text-neon-purple" />
            <AlertDescription className="text-sm">
              Creating marketplace listings requires Creator plan.{' '}
              <button
                onClick={() => {
                  handleClose();
                  openPricingModal('creator');
                }}
                className="underline font-semibold hover:text-neon-purple"
              >
                Upgrade now
              </button>
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="listing-title">Title</Label>
              <Input
                id="listing-title"
                placeholder="Give your listing a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={createMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="listing-type">Type</Label>
              <Select value={contentType} onValueChange={(v) => setContentType(v as typeof contentType)} disabled={createMutation.isPending}>
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
                min="0"
                step="1"
                placeholder="49"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                disabled={createMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="listing-description">Description</Label>
              <Textarea
                id="listing-description"
                placeholder="Describe what makes your design unique and worth purchasing"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                disabled={createMutation.isPending}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || !title || !description || !price}
                className="bg-gradient-to-r from-neon-green to-neon-purple hover:opacity-90"
              >
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Listing
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
