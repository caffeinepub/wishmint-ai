import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, MessageCircle } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useAppContext } from '../App';
import { copyToClipboard } from '../lib/clipboard';
import { createWhatsAppLink } from '../lib/whatsapp';
import { formatBirthdayPack } from '../features/generator/format';
import { exportCardImage } from '../features/cardExport/canvasExport';
import { toast } from 'sonner';
import { useState } from 'react';

export function OutputSection() {
  const { outputs, formData, selectedTemplate } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);

  if (!outputs) return null;

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
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              Your Birthday Pack
            </h2>
            <p className="text-muted-foreground text-lg">
              5 perfect wishes ready to share
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {outputCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.1}>
              <Card className="bg-card/80 backdrop-blur-sm border-neon-purple/20 hover:border-neon-purple/40 transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="text-2xl">{card.icon}</span>
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {card.content}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(card.content, card.title)}
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.5}>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={handleCopyAll}
              size="lg"
              variant="outline"
              className="gap-2"
            >
              <Copy className="w-5 h-5" />
              Copy All
            </Button>
            <Button
              onClick={handleWhatsAppShare}
              size="lg"
              variant="outline"
              className="gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Share on WhatsApp
            </Button>
            <Button
              onClick={handleDownloadCard}
              size="lg"
              className="gap-2 bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90"
              disabled={isExporting}
            >
              <Download className="w-5 h-5" />
              {isExporting ? 'Exporting...' : 'Download Card Image'}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
