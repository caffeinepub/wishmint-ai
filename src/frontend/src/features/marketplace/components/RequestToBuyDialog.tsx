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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, MessageCircle, Loader2, Check } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { useExpressInterest } from '../hooks/useExpressInterest';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import { copyToClipboard } from '../../../lib/clipboard';
import { createWhatsAppLink } from '../../../lib/whatsapp';
import { shortenPrincipal } from '../../../lib/principal';
import { toast } from 'sonner';
import type { MarketplaceListing } from '../../../backend';

interface RequestToBuyDialogProps {
  listing: MarketplaceListing;
  open: boolean;
  onClose: () => void;
}

export function RequestToBuyDialog({ listing, open, onClose }: RequestToBuyDialogProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const expressInterestMutation = useExpressInterest();
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const sellerPrincipal = shortenPrincipal(listing.creator.toString());
  const prefilledMessage = `Hi! I'm interested in purchasing your ${listing.contentType.__kind__} "${listing.title}" (Listing ID: ${listing.id.toString()}) for $${Number(listing.price)}. ${message}`;

  const handleCopy = async () => {
    await copyToClipboard(prefilledMessage);
    setCopied(true);
    toast.success('Message copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const whatsappUrl = createWhatsAppLink(prefilledMessage);
    window.open(whatsappUrl, '_blank');
  };

  const handleExpressInterest = () => {
    if (!isAuthenticated) {
      toast.info('Sign in to record your interest');
      return;
    }
    expressInterestMutation.mutate(
      { listingId: listing.id, message: prefilledMessage },
      {
        onSuccess: () => {
          setMessage('');
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    if (!expressInterestMutation.isPending) {
      setMessage('');
      setCopied(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Request to Buy</DialogTitle>
          <DialogDescription>
            Contact the seller to complete your purchase
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="bg-card/50 border-neon-green/20">
            <MessageCircle className="h-4 w-4 text-neon-green" />
            <AlertDescription className="text-sm">
              <strong>Seller:</strong> {sellerPrincipal}
              <br />
              <strong>Price:</strong> ${Number(listing.price)}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add any questions or details for the seller..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              disabled={expressInterestMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label>Preview Message</Label>
            <div className="p-3 rounded-md bg-muted/50 text-sm text-muted-foreground border border-border/50">
              {prefilledMessage}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={expressInterestMutation.isPending}
            className="w-full sm:w-auto"
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Message'}
          </Button>
          <Button
            variant="outline"
            onClick={handleWhatsApp}
            disabled={expressInterestMutation.isPending}
            className="w-full sm:w-auto"
          >
            <SiWhatsapp className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
          {isAuthenticated && (
            <Button
              onClick={handleExpressInterest}
              disabled={expressInterestMutation.isPending}
              className="w-full sm:w-auto bg-gradient-to-r from-neon-green to-neon-purple hover:opacity-90"
            >
              {expressInterestMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Record Interest
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
