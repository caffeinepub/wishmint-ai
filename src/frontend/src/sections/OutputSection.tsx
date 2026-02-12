import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Share2, Download, Sparkles, Link as LinkIcon, FileText } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useAppContext } from '../App';
import { copyToClipboard } from '../lib/clipboard';
import { createWhatsAppLink } from '../lib/whatsapp';
import { exportCardImage } from '../features/cardExport/canvasExport';
import { exportAsPDF } from '../features/cardExport/pdfExport';
import { useCreateSurpriseLink } from '../features/surprise/useSurpriseLinks';
import { useEntitlements } from '../features/subscription/useEntitlements';
import { toast } from 'sonner';

export function OutputSection() {
  const { outputs, formData, selectedTemplate, openPremiumDesigner, isAuthenticated, demoMode, openPricingModal } = useAppContext();
  const { entitlements, effectivePlan } = useEntitlements();
  const createSurpriseMutation = useCreateSurpriseLink();
  const [isExporting, setIsExporting] = useState(false);

  if (!outputs) return null;

  const outputCards = [
    { title: 'Main Wish', content: outputs.mainWish, icon: '🎂' },
    { title: 'WhatsApp Short', content: outputs.whatsappShort, icon: '💬' },
    { title: 'Instagram Caption', content: outputs.instagramCaption, icon: '📸' },
    { title: 'Mini Speech', content: outputs.miniSpeech, icon: '🎤' },
    { title: 'Hashtags', content: outputs.hashtags, icon: '#️⃣' },
  ];

  const handleCopy = (content: string, title: string) => {
    copyToClipboard(content);
    toast.success(`${title} copied!`);
  };

  const handleShareWhatsApp = (content: string) => {
    const url = createWhatsAppLink(content);
    window.open(url, '_blank');
  };

  const handleDownloadImage = async () => {
    if (demoMode) {
      toast.error('Demo Mode', {
        description: 'Sign in to download images.',
      });
      return;
    }

    if (!isAuthenticated) {
      toast.error('Sign in required', {
        description: 'Please sign in to download images.',
      });
      return;
    }

    setIsExporting(true);
    try {
      await exportCardImage(outputs.mainWish, formData.name, selectedTemplate);
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Export failed', {
        description: 'Failed to generate image. Please try again.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (demoMode) {
      toast.error('Demo Mode', {
        description: 'Sign in to download PDF.',
      });
      return;
    }

    if (!isAuthenticated) {
      toast.error('Sign in required', {
        description: 'Please sign in to download PDF.',
      });
      return;
    }

    setIsExporting(true);
    try {
      const includeWatermark = entitlements.watermarkDownloads;
      await exportAsPDF(outputs, formData.name, includeWatermark);
      toast.success('PDF downloaded!');
    } catch (error: any) {
      toast.error('Export failed', {
        description: error.message || 'Failed to generate PDF. Please try again.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateSurpriseLink = async () => {
    if (!isAuthenticated) {
      toast.error('Sign in required', {
        description: 'Please sign in to create surprise links.',
      });
      return;
    }

    if (!entitlements.surpriseLinks) {
      toast.error('Premium Feature', {
        description: 'Surprise links require Pro or Creator plan.',
      });
      openPricingModal('pro');
      return;
    }

    try {
      const surpriseId = await createSurpriseMutation.mutateAsync({
        recipientName: formData.name,
        message: outputs.mainWish,
      });

      const surpriseUrl = `${window.location.origin}${window.location.pathname}?surprise=${surpriseId}`;
      await navigator.clipboard.writeText(surpriseUrl);
      toast.success('Surprise link copied!', {
        description: 'Share this link to create a magical reveal experience.',
      });
    } catch (error: any) {
      // Error already handled by mutation
    }
  };

  return (
    <section id="outputs" className="section-padding px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="section-container max-w-6xl">
        <Reveal>
          <div className="text-center mb-8">
            <h2 className="section-heading bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              Your Birthday Pack
            </h2>
            <p className="section-subheading mt-4">
              5 personalized messages ready to share
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {outputCards.map((card, index) => (
            <Reveal key={index}>
              <Card className="bg-card/60 backdrop-blur-sm border-neon-purple/20 shadow-card h-full flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-2xl">{card.icon}</span>
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm leading-relaxed mb-4 flex-1 whitespace-pre-wrap">
                    {card.content}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(card.content, card.title)}
                      className="flex-1 border-neon-purple/30 hover:bg-neon-purple/10"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShareWhatsApp(card.content)}
                      className="flex-1 border-neon-green/30 hover:bg-neon-green/10"
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Download Card Image'}
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              variant="outline"
              className="border-neon-purple/50 hover:bg-neon-purple/10"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download as PDF
            </Button>
            <Button
              onClick={handleCreateSurpriseLink}
              disabled={createSurpriseMutation.isPending}
              variant="outline"
              className="border-neon-green/50 hover:bg-neon-green/10"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              {entitlements.surpriseLinks ? 'Create Surprise Link' : '🔒 Surprise Link (Pro)'}
            </Button>
            <Button
              onClick={openPremiumDesigner}
              variant="outline"
              className="border-neon-purple/50 hover:bg-neon-purple/10"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Premium Card
            </Button>
          </div>
          {entitlements.watermarkDownloads && (
            <p className="text-xs text-center text-muted-foreground mt-4">
              Free plan downloads include watermark. Upgrade to Pro to remove watermark.
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
