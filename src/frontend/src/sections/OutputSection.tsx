import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, MessageCircle, Lock, Sparkles } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useAppContext } from '../App';
import { copyToClipboard } from '../lib/clipboard';
import { createWhatsAppLink } from '../lib/whatsapp';
import { formatBirthdayPack } from '../features/generator/format';
import { exportCardImage } from '../features/cardExport/canvasExport';
import { toast } from 'sonner';
import { useState } from 'react';

export function OutputSection() {
  const { outputs, formData, selectedTemplate, isAuthenticated, demoMode, openPremiumDesigner } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);

  if (!outputs) return null;

  // Download is only available for authenticated users (not in demo mode)
  const canDownload = isAuthenticated && !demoMode;

  const handleCopy = (text: string, label: string) => {
    copyToClipboard(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleCopyAll = () => {
    const allText = formatBirthdayPack(outputs);
    copyToClipboard(allText);
    toast.success('All wishes copied to clipboard!');
  };

  const handleWhatsAppShare = () => {
    const allText = formatBirthdayPack(outputs);
    const url = createWhatsAppLink(allText);
    window.open(url, '_blank');
  };

  const handleDownloadCard = async () => {
    if (!canDownload) {
      toast.error('Sign in to download card images');
      return;
    }

    if (!formData.name) {
      toast.error('Please enter a name first');
      return;
    }
    
    setIsExporting(true);
    try {
      await exportCardImage(outputs.mainWish, formData.name, selectedTemplate);
      toast.success('Card image downloaded!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export card image');
    } finally {
      setIsExporting(false);
    }
  };

  const outputCards = [
    { title: 'Main Wish', content: outputs.mainWish, icon: '💝' },
    { title: 'WhatsApp Short', content: outputs.whatsappShort, icon: '💬' },
    { title: 'Instagram Caption', content: outputs.instagramCaption, icon: '📸' },
    { title: 'Mini Speech', content: outputs.miniSpeech, icon: '🎤' },
    { title: 'Hashtags', content: outputs.hashtags, icon: '#️⃣' },
  ];

  return (
    <section id="outputs" className="section-padding px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="section-container max-w-6xl">
        <Reveal>
          <div className="text-center mb-12 space-y-3">
            <h2 className="section-heading bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              Your Birthday Pack
            </h2>
            <p className="section-subheading">
              5 perfect wishes ready to share
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5 mb-8">
          {outputCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.1}>
              <Card className="bg-card/70 backdrop-blur-sm border-neon-purple/20 hover:border-neon-purple/40 transition-all shadow-card h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <span className="text-2xl">{card.icon}</span>
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed text-sm">
                    {card.content}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(card.content, card.title)}
                    className="w-full h-9 text-sm"
                  >
                    <Copy className="w-3.5 h-3.5 mr-2" />
                    Copy
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.5}>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={handleCopyAll}
              size="lg"
              variant="outline"
              className="gap-2 h-11"
            >
              <Copy className="w-4 h-4" />
              Copy All
            </Button>
            <Button
              onClick={handleWhatsAppShare}
              size="lg"
              variant="outline"
              className="gap-2 h-11"
            >
              <MessageCircle className="w-4 h-4" />
              Share on WhatsApp
            </Button>
            <Button
              onClick={handleDownloadCard}
              size="lg"
              variant="outline"
              className="gap-2 h-11"
              disabled={!canDownload || isExporting}
              title={!canDownload ? 'Sign in to download card images' : ''}
            >
              {!canDownload ? (
                <>
                  <Lock className="w-4 h-4" />
                  Sign in to Download
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  {isExporting ? 'Exporting...' : 'Download Card Image'}
                </>
              )}
            </Button>
            <Button
              onClick={openPremiumDesigner}
              size="lg"
              className="gap-2 h-11 bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90"
            >
              <Sparkles className="w-4 h-4" />
              Create Premium Card
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
