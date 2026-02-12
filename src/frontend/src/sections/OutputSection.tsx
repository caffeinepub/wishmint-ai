import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Share2, Download, Sparkles } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useAppContext } from '../App';
import { copyToClipboard } from '../lib/clipboard';
import { createWhatsAppLink } from '../lib/whatsapp';
import { formatBirthdayPack } from '../features/generator/format';
import { exportCardImage, generateCardVariationBlob } from '../features/cardExport/canvasExport';
import { CardVariationsCarousel } from '../features/cardExport/components/CardVariationsCarousel';
import { GenerationConfetti } from '../features/cardExport/components/GenerationConfetti';
import { getVariationCount } from '../features/cardExport/generateCardVariations';
import type { CardTheme } from '../features/cardExport/cardThemes';
import { toast } from 'sonner';

export function OutputSection() {
  const { outputs, formData, selectedTemplate, demoMode, openPremiumDesigner } = useAppContext();
  
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('luxury');
  const [variationBlobUrls, setVariationBlobUrls] = useState<string[]>([]);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Generate variations when outputs change
  useEffect(() => {
    if (!outputs) {
      setVariationBlobUrls([]);
      return;
    }

    const generateVariations = async () => {
      setIsGeneratingVariations(true);
      
      // Clean up old blob URLs
      variationBlobUrls.forEach(url => URL.revokeObjectURL(url));
      
      const count = getVariationCount();
      const newBlobUrls: string[] = [];
      
      for (let i = 0; i < count; i++) {
        const blob = await generateCardVariationBlob(
          outputs.mainWish,
          formData.name,
          selectedTemplate,
          selectedTheme,
          i
        );
        
        if (blob) {
          const url = URL.createObjectURL(blob);
          newBlobUrls.push(url);
        }
      }
      
      setVariationBlobUrls(newBlobUrls);
      setSelectedVariationIndex(0);
      setIsGeneratingVariations(false);
      setShowConfetti(true);
    };

    generateVariations();

    return () => {
      variationBlobUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [outputs, selectedTheme]);

  if (!outputs) return null;

  const handleCopy = (text: string, label: string) => {
    copyToClipboard(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleCopyAll = () => {
    const formatted = formatBirthdayPack(outputs);
    copyToClipboard(formatted);
    toast.success('All outputs copied to clipboard!');
  };

  const handleShareWhatsApp = () => {
    const formatted = formatBirthdayPack(outputs);
    const url = createWhatsAppLink(formatted);
    window.open(url, '_blank');
  };

  const handleDownloadCard = async () => {
    if (demoMode) {
      toast.error('Sign in required', {
        description: 'Please sign in to download card images.',
      });
      return;
    }

    try {
      await exportCardImage(
        outputs.mainWish,
        formData.name,
        selectedTemplate,
        selectedTheme,
        selectedVariationIndex
      );
      toast.success('Card image downloaded!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download card image');
    }
  };

  const handleCreatePremiumCard = () => {
    if (demoMode) {
      toast.error('Sign in required', {
        description: 'Please sign in to create premium cards.',
      });
      return;
    }
    openPremiumDesigner();
  };

  const outputCards = [
    { label: 'Main Wish', content: outputs.mainWish, icon: '🎂' },
    { label: 'WhatsApp Short', content: outputs.whatsappShort, icon: '💬' },
    { label: 'Instagram Caption', content: outputs.instagramCaption, icon: '📸' },
    { label: 'Mini Speech', content: outputs.miniSpeech, icon: '🎤' },
    { label: 'Hashtags', content: outputs.hashtags, icon: '#️⃣' },
  ];

  return (
    <section id="outputs" className="w-full section-padding px-4 sm:px-6 lg:px-8">
      <GenerationConfetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="section-container max-w-6xl">
        <Reveal>
          <div className="text-center mb-12 space-y-3">
            <h2 className="section-heading bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              Your Birthday Pack
            </h2>
            <p className="section-subheading">
              5 personalized outputs ready to use
            </p>
          </div>
        </Reveal>

        {/* Card Preview with Variations */}
        <Reveal delay={0.1}>
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-semibold">Card Preview</h3>
              <div className="flex items-center gap-3">
                <label htmlFor="theme-select" className="text-sm text-muted-foreground">
                  Theme:
                </label>
                <Select value={selectedTheme} onValueChange={(value) => setSelectedTheme(value as CardTheme)}>
                  <SelectTrigger id="theme-select" className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="cute">Cute</SelectItem>
                    <SelectItem value="cinematic">Cinematic</SelectItem>
                    <SelectItem value="modern-instagram">Modern Instagram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isGeneratingVariations ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center space-y-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple mx-auto" />
                  <p className="text-muted-foreground">Generating premium variations...</p>
                </div>
              </div>
            ) : variationBlobUrls.length > 0 ? (
              <div className="animate-fade-in-up">
                <CardVariationsCarousel
                  variations={variationBlobUrls}
                  selectedIndex={selectedVariationIndex}
                  onVariationSelect={setSelectedVariationIndex}
                />
              </div>
            ) : null}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {outputCards.map((card, index) => (
            <Reveal key={card.label} delay={index * 0.1 + 0.2}>
              <Card className="bg-card/60 backdrop-blur-sm border-neon-purple/20 shadow-card h-full flex flex-col hover:shadow-neon transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-2xl">{card.icon}</span>
                    {card.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {card.content}
                  </p>
                  <Button
                    onClick={() => handleCopy(card.content, card.label)}
                    variant="outline"
                    size="sm"
                    className="w-full border-neon-green/50 hover:bg-neon-green/10"
                  >
                    <Copy className="w-3 h-3 mr-2" />
                    Copy
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.8}>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={handleCopyAll}
              className="bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy All
            </Button>
            <Button
              onClick={handleShareWhatsApp}
              variant="outline"
              className="border-neon-green/50 hover:bg-neon-green/10"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share on WhatsApp
            </Button>
            <Button
              onClick={handleDownloadCard}
              variant="outline"
              className="border-neon-purple/50 hover:bg-neon-purple/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Card Image
            </Button>
            <Button
              onClick={handleCreatePremiumCard}
              variant="outline"
              className="border-neon-purple/50 hover:bg-neon-purple/10"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Premium Card
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
