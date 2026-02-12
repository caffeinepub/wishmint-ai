import { Button } from '@/components/ui/button';
import { Download, Share2, MessageCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import type { PremiumDesignerState } from './types';
import { exportPremiumCard } from '../cardExport/canvasExport';
import { copyToClipboard } from '../../lib/clipboard';
import { createWhatsAppLink } from '../../lib/whatsapp';

interface ExportActionsProps {
  designerState: PremiumDesignerState;
  wishText: string;
  recipientName: string;
}

export function ExportActions({ designerState, wishText, recipientName }: ExportActionsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadSquare = async () => {
    if (!wishText || !recipientName) {
      toast.error('Missing wish text or recipient name');
      return;
    }

    setIsExporting(true);
    try {
      await exportPremiumCard(wishText, recipientName, designerState, 'square');
      toast.success('Card downloaded!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export card');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadStory = async () => {
    if (!wishText || !recipientName) {
      toast.error('Missing wish text or recipient name');
      return;
    }

    setIsExporting(true);
    try {
      await exportPremiumCard(wishText, recipientName, designerState, 'story');
      toast.success('Instagram Story downloaded!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export story');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyText = () => {
    copyToClipboard(wishText);
    toast.success('Text copied to clipboard!');
  };

  const handleWhatsAppShare = () => {
    const url = createWhatsAppLink(wishText);
    window.open(url, '_blank');
  };

  const handleInstagramShare = async () => {
    if (!wishText || !recipientName) {
      toast.error('Missing wish text or recipient name');
      return;
    }

    // Try Web Share API first
    if (navigator.share) {
      try {
        // Generate the image first
        setIsExporting(true);
        const blob = await exportPremiumCard(wishText, recipientName, designerState, 'story', true);
        setIsExporting(false);

        if (blob) {
          const file = new File([blob], 'birthday-card.png', { type: 'image/png' });
          await navigator.share({
            files: [file],
            title: `Happy Birthday ${recipientName}!`,
            text: wishText,
          });
          toast.success('Shared successfully!');
        }
      } catch (error) {
        console.error('Share failed:', error);
        toast.info('Download the image and upload it to Instagram manually');
      }
    } else {
      toast.info('Download the image and upload it to Instagram manually');
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleDownloadSquare}
          disabled={isExporting}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Download Image
        </Button>
        <Button
          onClick={handleDownloadStory}
          disabled={isExporting}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Instagram Story
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button
          onClick={handleWhatsAppShare}
          variant="outline"
          className="gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </Button>
        <Button
          onClick={handleInstagramShare}
          variant="outline"
          className="gap-2"
          disabled={isExporting}
        >
          <Share2 className="w-4 h-4" />
          Instagram
        </Button>
        <Button
          onClick={handleCopyText}
          variant="outline"
          className="gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy Text
        </Button>
      </div>
    </div>
  );
}
