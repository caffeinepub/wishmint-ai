import { Button } from '@/components/ui/button';
import { Download, Share2, Copy } from 'lucide-react';
import { SiWhatsapp, SiInstagram } from 'react-icons/si';
import { exportPremiumCard } from '../cardExport/canvasExport';
import { copyToClipboard } from '../../lib/clipboard';
import { createWhatsAppLink } from '../../lib/whatsapp';
import { toast } from 'sonner';
import type { PremiumDesignerState } from './types';

interface ExportActionsProps {
  designerState: PremiumDesignerState;
  wishText: string;
  recipientName: string;
}

export function ExportActions({ designerState, wishText, recipientName }: ExportActionsProps) {
  const handleDownloadSquare = async () => {
    try {
      await exportPremiumCard(wishText, recipientName, designerState, 'square', false);
      toast.success('Square card downloaded!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download card');
    }
  };

  const handleDownloadStory = async () => {
    try {
      await exportPremiumCard(wishText, recipientName, designerState, 'story', false);
      toast.success('Story card downloaded!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download card');
    }
  };

  const handleShareWhatsApp = async () => {
    try {
      const blob = await exportPremiumCard(wishText, recipientName, designerState, 'square', true);
      if (!blob) {
        toast.error('Failed to generate card for sharing');
        return;
      }

      // For WhatsApp, we'll use the text link approach
      const message = `🎉 Happy Birthday ${recipientName}! 🎂\n\n${wishText}\n\nMade with ❤️ by WishMint AI`;
      const url = createWhatsAppLink(message);
      window.open(url, '_blank');
      toast.success('Opening WhatsApp...');
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('Failed to share on WhatsApp');
    }
  };

  const handleShareInstagram = async () => {
    try {
      const blob = await exportPremiumCard(wishText, recipientName, designerState, 'story', true);
      if (!blob) {
        toast.error('Failed to generate card for sharing');
        return;
      }

      // Try Web Share API
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], `birthday-card-${recipientName}.png`, { type: 'image/png' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `Happy Birthday ${recipientName}!`,
            text: 'Check out this birthday card!',
          });
          toast.success('Shared successfully!');
          return;
        }
      }

      // Fallback: download the image
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `birthday-story-${recipientName.toLowerCase().replace(/\s+/g, '-')}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast.info('Card downloaded! Share it on Instagram from your gallery.');
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('Failed to share on Instagram');
    }
  };

  const handleCopyText = () => {
    const message = `🎉 Happy Birthday ${recipientName}! 🎂\n\n${wishText}\n\nMade with ❤️ by WishMint AI`;
    copyToClipboard(message);
    toast.success('Text copied to clipboard!');
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center p-4 bg-card/40 backdrop-blur-sm rounded-lg border border-border/50">
      <Button
        onClick={handleDownloadSquare}
        className="bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold"
      >
        <Download className="w-4 h-4 mr-2" />
        Download Square
      </Button>
      <Button
        onClick={handleDownloadStory}
        variant="outline"
        className="border-neon-purple/50 hover:bg-neon-purple/10"
      >
        <Download className="w-4 h-4 mr-2" />
        Download Story
      </Button>
      <Button
        onClick={handleShareWhatsApp}
        variant="outline"
        className="border-neon-green/50 hover:bg-neon-green/10"
      >
        <SiWhatsapp className="w-4 h-4 mr-2" />
        WhatsApp
      </Button>
      <Button
        onClick={handleShareInstagram}
        variant="outline"
        className="border-neon-purple/50 hover:bg-neon-purple/10"
      >
        <SiInstagram className="w-4 h-4 mr-2" />
        Instagram
      </Button>
      <Button
        onClick={handleCopyText}
        variant="outline"
        className="border-border hover:bg-accent"
      >
        <Copy className="w-4 h-4 mr-2" />
        Copy Text
      </Button>
    </div>
  );
}
